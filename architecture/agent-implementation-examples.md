# AI Agent Implementation Examples

## **Executive Summary**

This document provides concrete code examples for implementing EcareBots AI agents using LangChain and Python. Includes pseudo-code for agent workflows, tool definitions, memory management, and production patterns.

---

## **Part 1: Basic Agent Setup with LangChain**

### **1.1 Installation**

```bash
pip install langchain langchain-openai langchain-community python-dotenv
pip install pydantic
```

### **1.2 Environment Setup**

```python
# .env
OPENAI_API_KEY=your-api-key
HOSPITAL_API_URL=https://api.hospital.com
INSURANCE_API_URL=https://api.insurance.com
PHARMACY_API_URL=https://api.pharmacy.com
```

### **1.3 Base Configuration**

```python
# config/agent_config.py
from pydantic import BaseModel
from typing import Optional

class AgentConfig(BaseModel):
    """Configuration for EcareBots agents"""
    model: str = "gpt-4-turbo-preview"
    temperature: float = 0.3  # Lower = more deterministic
    max_tokens: int = 2048
    timeout: int = 30  # seconds
    max_retries: int = 3

class ToolConfig(BaseModel):
    """Configuration for agent tools"""
    tool_name: str
    description: str
    required_params: list[str]
    optional_params: list[str] = []
    timeout: int = 10
```

---

## **Part 2: Scheduler Agent Implementation**

### **2.1 Tool Definitions**

```python
# tools/scheduler_tools.py
from langchain.tools import tool
from typing import Any
import requests
from datetime import datetime, timedelta

class SchedulerTools:
    """Tools for appointment scheduling"""

    @tool("check_availability")
    def check_availability(provider: str, specialty: str, date: str) -> dict:
        """
        Check available appointment slots for a provider.
        
        Args:
            provider: Doctor name (e.g., "Dr. Smith")
            specialty: Medical specialty (e.g., "Cardiology")
            date: Date in YYYY-MM-DD format
        
        Returns:
            Dictionary with available time slots
        """
        url = "https://api.ehr.com/appointments/availability"
        response = requests.get(
            url,
            params={
                "provider_name": provider,
                "specialty": specialty,
                "date": date
            },
            timeout=10
        )
        return response.json()

    @tool("book_appointment")
    def book_appointment(
        provider: str,
        date: str,
        time: str,
        reason: str
    ) -> dict:
        """
        Book an appointment with a provider.
        
        Args:
            provider: Doctor name
            date: Appointment date (YYYY-MM-DD)
            time: Appointment time (HH:MM)
            reason: Reason for visit
        
        Returns:
            Confirmation with appointment ID
        """
        url = "https://api.ehr.com/appointments/book"
        payload = {
            "provider_name": provider,
            "appointment_date": date,
            "appointment_time": time,
            "reason_for_visit": reason,
            "confirmation_method": "voice"  # Accessibility
        }
        response = requests.post(url, json=payload, timeout=10)
        return response.json()

    @tool("send_reminder")
    def send_reminder(
        appointment_id: str,
        method: str = "voice"
    ) -> dict:
        """
        Send appointment reminder via voice.
        
        Args:
            appointment_id: ID of appointment
            method: Reminder method (voice, sms, email)
        
        Returns:
            Status of reminder
        """
        url = "https://api.ecarebots.com/reminders"
        payload = {
            "appointment_id": appointment_id,
            "method": method,
            "timing": "24_hours_before"  # Fixed timing
        }
        response = requests.post(url, json=payload, timeout=10)
        return response.json()
```

### **2.2 Agent Implementation**

```python
# agents/scheduler_agent.py
from langchain.agents import initialize_agent, AgentType, Tool
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from tools.scheduler_tools import SchedulerTools
from config.agent_config import AgentConfig

class SchedulerAgent:
    """
    AI Agent for healthcare appointment scheduling.
    
    Capabilities:
    - Natural language appointment requests
    - Provider search and disambiguation
    - Availability checking
    - Automatic booking
    - Voice-based confirmation
    """

    def __init__(self, config: AgentConfig = None):
        self.config = config or AgentConfig()
        self.llm = ChatOpenAI(
            model_name=self.config.model,
            temperature=self.config.temperature,
            max_tokens=self.config.max_tokens
        )
        
        # Initialize tools
        self.tools = SchedulerTools()
        self.tools_list = self._create_tools()
        
        # Memory for conversation history
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        
        # Initialize agent
        self.agent = initialize_agent(
            self.tools_list,
            self.llm,
            agent=AgentType.OPENAI_FUNCTIONS,
            memory=self.memory,
            verbose=True,
            max_iterations=5,
            timeout=self.config.timeout
        )

    def _create_tools(self) -> list[Tool]:
        """Create LangChain Tool objects"""
        return [
            Tool(
                name="check_availability",
                func=self.tools.check_availability,
                description="Check available appointment slots for a specific provider and date"
            ),
            Tool(
                name="book_appointment",
                func=self.tools.book_appointment,
                description="Book an appointment with a provider"
            ),
            Tool(
                name="send_reminder",
                func=self.tools.send_reminder,
                description="Send appointment reminder to patient via voice"
            )
        ]

    def process_voice_command(self, user_input: str) -> dict:
        """
        Process voice command and schedule appointment.
        
        Example inputs:
        - "I need to see a cardiologist next week"
        - "Schedule appointment with Dr. Smith Tuesday at 2pm"
        - "Book follow-up for my blood pressure"
        
        Returns:
            dict with appointment details and confirmation message
        """
        system_prompt = """
        You are a healthcare scheduling assistant for elderly and disabled users.
        
        Your role:
        1. Understand appointment requests in natural language
        2. Extract key details: provider, specialty, date, time, reason
        3. Check availability using available tools
        4. Confirm details with user before booking
        5. Provide clear, simple confirmation
        
        Important rules:
        - Be concise and clear (these are elderly users)
        - Confirm all details before booking
        - Always offer voice-based reminders
        - Handle missing information gracefully
        """
        
        try:
            response = self.agent.run(
                input=user_input,
                system_message=system_prompt
            )
            
            return {
                "success": True,
                "response": response,
                "conversation_history": self.memory.buffer
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "fallback_message": "I'm having trouble scheduling that appointment. Please try again or call our support line."
            }

    def reset_memory(self):
        """Clear conversation history"""
        self.memory.clear()
```

---

## **Part 3: Insurance Agent Implementation**

### **3.1 Tool Definitions**

```python
# tools/insurance_tools.py
from langchain.tools import tool
import requests

class InsuranceTools:
    """Tools for insurance verification and optimization"""

    @tool("check_eligibility")
    def check_eligibility(
        member_id: str,
        group_number: str,
        first_name: str,
        last_name: str,
        date_of_birth: str
    ) -> dict:
        """
        Check real-time insurance eligibility.
        
        Returns eligibility status, copay, deductible, out-of-pocket max.
        """
        url = "https://api.insurance.com/eligibility"
        payload = {
            "member_id": member_id,
            "group_number": group_number,
            "first_name": first_name,
            "last_name": last_name,
            "date_of_birth": date_of_birth
        }
        response = requests.post(url, json=payload, timeout=15)
        return response.json()

    @tool("check_coverage")
    def check_coverage(procedure: str, provider: str) -> dict:
        """
        Check if specific procedure is covered.
        
        Args:
            procedure: Procedure/service code (e.g., "99213" for office visit)
            provider: Provider NPI or name
        
        Returns:
            Coverage details and out-of-pocket costs
        """
        url = "https://api.insurance.com/coverage"
        response = requests.get(
            url,
            params={"procedure": procedure, "provider": provider},
            timeout=10
        )
        return response.json()

    @tool("find_in_network_providers")
    def find_in_network_providers(specialty: str, zip_code: str) -> dict:
        """
        Find in-network providers in a given area.
        
        Args:
            specialty: Medical specialty
            zip_code: Patient zip code
        
        Returns:
            List of in-network providers with ratings
        """
        url = "https://api.insurance.com/providers"
        response = requests.get(
            url,
            params={"specialty": specialty, "zip_code": zip_code},
            timeout=10
        )
        return response.json()
```

### **3.2 Agent Implementation**

```python
# agents/insurance_agent.py
from langchain.agents import initialize_agent, AgentType
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from tools.insurance_tools import InsuranceTools

class InsuranceAgent:
    """
    AI Agent for insurance verification and optimization.
    
    Capabilities:
    - Real-time eligibility checking
    - Coverage verification for procedures
    - In-network provider discovery
    - Cost estimation
    - Policy recommendations
    """

    def __init__(self):
        self.llm = ChatOpenAI(
            model_name="gpt-4-turbo-preview",
            temperature=0.3
        )
        self.tools = InsuranceTools()
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        
        self.agent = initialize_agent(
            [
                # Tool definitions here
            ],
            self.llm,
            agent=AgentType.OPENAI_FUNCTIONS,
            memory=self.memory,
            verbose=True
        )

    def check_insurance_status(self, patient_data: dict) -> dict:
        """
        Check complete insurance status for patient.
        
        Args:
            patient_data: Dictionary with member_id, group_number, name, DOB
        
        Returns:
            Insurance status, copay, deductible, coverage details
        """
        prompt = f"""
        Check the insurance eligibility and coverage for the following patient:
        Member ID: {patient_data['member_id']}
        Name: {patient_data['first_name']} {patient_data['last_name']}
        DOB: {patient_data['date_of_birth']}
        
        Provide:
        1. Current eligibility status
        2. Copay amounts
        3. Deductible status
        4. Out-of-pocket maximum
        5. Any coverage limitations
        
        Format response for voice delivery (short, simple sentences).
        """
        
        try:
            response = self.agent.run(input=prompt)
            return {
                "success": True,
                "status": response
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
```

---

## **Part 4: Memory Management Patterns**

### **4.1 Custom Memory with Context**

```python
# memory/patient_memory.py
from langchain.memory import ConversationBufferMemory
from typing import List, Dict
from datetime import datetime

class PatientMemory(ConversationBufferMemory):
    """
    Custom memory that maintains patient context.
    
    Stores:
    - Conversation history
    - Patient conditions and medications
    - Recent appointments
    - Insurance status
    - Preferences (voice, text, etc.)
    """
    
    def __init__(self, patient_id: str, **kwargs):
        super().__init__(**kwargs)
        self.patient_id = patient_id
        self.patient_context = {}
        self.last_action = None
        self.action_timestamp = None
    
    def add_context(self, context_type: str, data: Dict):
        """Add patient context information"""
        self.patient_context[context_type] = {
            "data": data,
            "updated_at": datetime.now().isoformat()
        }
    
    def get_context_summary(self) -> str:
        """
        Get summary of patient context for LLM.
        
        Returns:
            Formatted string with patient context
        """
        summary = f"Patient {self.patient_id}:\n"
        
        if "medications" in self.patient_context:
            meds = self.patient_context["medications"]["data"]
            summary += f"Current medications: {', '.join(meds)}\n"
        
        if "conditions" in self.patient_context:
            conditions = self.patient_context["conditions"]["data"]
            summary += f"Known conditions: {', '.join(conditions)}\n"
        
        if "preferences" in self.patient_context:
            prefs = self.patient_context["preferences"]["data"]
            summary += f"Communication preference: {prefs.get('method', 'voice')}\n"
        
        return summary
    
    def record_action(self, action_type: str, action_id: str):
        """Record agent action for tracking"""
        self.last_action = {
            "type": action_type,
            "id": action_id,
            "timestamp": datetime.now().isoformat()
        }
```

---

## **Part 5: Error Handling & Fallback Patterns**

### **5.1 Resilient Agent Wrapper**

```python
# agents/resilient_agent.py
from typing import Dict, Optional
import logging
from functools import wraps
from time import sleep

logger = logging.getLogger(__name__)

class ResilientAgent:
    """
    Wrapper for agents with error handling and fallback.
    
    Handles:
    - API timeouts
    - Invalid inputs
    - Agent hallucinations
    - Graceful degradation
    """
    
    def __init__(self, agent, max_retries: int = 3):
        self.agent = agent
        self.max_retries = max_retries
    
    def run_with_fallback(self, input_text: str) -> Dict:
        """
        Run agent with automatic fallback on error.
        
        Fallback strategy:
        1. Try agent execution
        2. If timeout, return simple response
        3. If validation error, return error message
        4. Log all errors for monitoring
        """
        for attempt in range(1, self.max_retries + 1):
            try:
                logger.info(f"Agent execution attempt {attempt}/{self.max_retries}")
                result = self.agent.process_voice_command(input_text)
                
                if result.get("success"):
                    return result
                    
            except TimeoutError:
                logger.warning(f"Timeout on attempt {attempt}")
                if attempt < self.max_retries:
                    sleep(2 ** attempt)  # Exponential backoff
                    continue
                    
            except ValueError as e:
                logger.error(f"Validation error: {e}")
                return {
                    "success": False,
                    "error": "Invalid input",
                    "fallback_message": "I didn't understand that. Please try again."
                }
            
            except Exception as e:
                logger.error(f"Unexpected error: {e}")
                continue
        
        # All retries exhausted
        return {
            "success": False,
            "error": "Service unavailable",
            "fallback_message": "I'm experiencing technical difficulties. Please try again later or call support."
        }
    
    def validate_input(self, user_input: str) -> bool:
        """
        Validate user input before processing.
        
        Checks:
        - Not empty
        - Not too long (prevent prompt injection)
        - Contains valid characters
        """
        if not user_input or len(user_input.strip()) == 0:
            return False
        
        if len(user_input) > 1000:
            return False
        
        return True
```

---

## **Part 6: Agent Orchestration**

### **6.1 Multi-Agent Router**

```python
# agents/orchestrator.py
from typing import Dict
from agents.scheduler_agent import SchedulerAgent
from agents.insurance_agent import InsuranceAgent
from agents.medication_agent import MedicationAgent
from langchain_openai import ChatOpenAI

class AgentOrchestrator:
    """
    Routes requests to appropriate specialized agents.
    
    Agents:
    - Scheduler: Appointment scheduling
    - Insurance: Coverage and eligibility
    - Medication: Prescription and refill management
    - Document: Document expiry tracking
    - FrontDesk: Clinic check-in automation
    """
    
    def __init__(self):
        self.scheduler_agent = SchedulerAgent()
        self.insurance_agent = InsuranceAgent()
        self.medication_agent = MedicationAgent()
        
        # Intent classification LLM
        self.classifier = ChatOpenAI(
            model_name="gpt-3.5-turbo",
            temperature=0
        )
    
    def classify_intent(self, user_input: str) -> str:
        """
        Classify user intent to route to correct agent.
        
        Returns:
            Intent: schedule, insurance, medication, document, frontdesk
        """
        prompt = f"""
        Classify the following user request into one category:
        - schedule: Appointment scheduling or rescheduling
        - insurance: Insurance verification or coverage questions
        - medication: Medication refills or adherence
        - document: Document expiry or medical records
        - frontdesk: Clinic check-in or waiting room info
        
        User: {user_input}
        
        Respond with ONLY the category name.
        """
        
        response = self.classifier.predict(prompt)
        return response.strip().lower()
    
    def process_request(self, user_input: str) -> Dict:
        """
        Process user request by routing to appropriate agent.
        
        Args:
            user_input: Natural language request from user
        
        Returns:
            Response from appropriate agent
        """
        intent = self.classify_intent(user_input)
        
        if intent == "schedule":
            return self.scheduler_agent.process_voice_command(user_input)
        
        elif intent == "insurance":
            return self.insurance_agent.process_voice_command(user_input)
        
        elif intent == "medication":
            return self.medication_agent.process_voice_command(user_input)
        
        else:
            return {
                "success": False,
                "error": f"Unknown intent: {intent}",
                "fallback_message": "I'm not sure how to help with that. Can you try rephrasing your request?"
            }
```

---

## **Part 7: Testing Agents**

### **7.1 Unit Tests**

```python
# tests/test_scheduler_agent.py
import pytest
from agents.scheduler_agent import SchedulerAgent
from config.agent_config import AgentConfig

class TestSchedulerAgent:
    
    @pytest.fixture
    def agent(self):
        config = AgentConfig(temperature=0.1, timeout=5)
        return SchedulerAgent(config)
    
    def test_voice_command_processing(self, agent):
        """Test processing a simple voice command"""
        result = agent.process_voice_command(
            "I need to schedule an appointment with Dr. Smith next Tuesday"
        )
        assert result["success"] == True
        assert "appointment" in result["response"].lower()
    
    def test_invalid_input_handling(self, agent):
        """Test handling of invalid input"""
        result = agent.process_voice_command("")
        assert result["success"] == False
    
    def test_memory_persistence(self, agent):
        """Test conversation memory"""
        agent.process_voice_command("Schedule with Dr. Smith")
        history = agent.memory.buffer
        assert len(history) > 0
```

---

## **Best Practices**

### **Do's** ✅
- ✅ Always validate inputs before processing
- ✅ Log all agent actions (without PHI)
- ✅ Implement timeouts on all API calls
- ✅ Use conversational memory for context
- ✅ Provide fallback messages for errors
- ✅ Test with actual user scenarios
- ✅ Monitor agent performance metrics

### **Don'ts** ❌
- ❌ Don't expose sensitive info in error messages
- ❌ Don't make medical decisions without confirmation
- ❌ Don't retry failed API calls indefinitely
- ❌ Don't log PHI (Protected Health Information)
- ❌ Don't trust user input without validation
- ❌ Don't run agents without error handling

---

<div align="center">

**Related:** [AI Agent Design](./ai-agent-design.md)  
**Integration:** [Integration Guide](./integration-guide.md)  
**Questions?** [GitHub Issues](https://github.com/ArjunFrancis/ecarebots/issues)

</div>
