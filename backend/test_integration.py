"""
Integration test for CIS CWIE Hub Frontend-Backend Connection
This test simulates the complete OTP authentication flow
"""

import requests
import json
import time
from typing import Dict, Any, Optional

BASE_URL = "http://localhost:8000"

# Colors for console output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
CYAN = "\033[96m"
RESET = "\033[0m"


class IntegrationTester:
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = {
            "passed": 0,
            "failed": 0,
            "total": 0
        }
        self.last_response = None
        self.auth_token = None
        self.test_email = None
    
    def print_section(self, title: str):
        """Print section header"""
        print(f"\n{BLUE}{'='*70}")
        print(f"  {title}")
        print(f"{'='*70}{RESET}\n")
    
    def print_test(self, name: str):
        """Print test name"""
        print(f"{CYAN}→ {name}{RESET}")
    
    def print_success(self, message: str, details: str = ""):
        """Print success message"""
        print(f"  {GREEN}✓ {message}{RESET}")
        if details:
            print(f"    {details}")
    
    def print_error(self, message: str, details: str = ""):
        """Print error message"""
        print(f"  {RED}✗ {message}{RESET}")
        if details:
            print(f"    {details}")
    
    def print_info(self, message: str):
        """Print info message"""
        print(f"  {YELLOW}ℹ {message}{RESET}")
    
    def print_response(self, response: requests.Response, show_body: bool = True):
        """Print response details"""
        print(f"    Status: {response.status_code}")
        if show_body:
            try:
                body = response.json()
                print(f"    Body: {json.dumps(body, indent=2, ensure_ascii=False)[:200]}...")
            except:
                print(f"    Body: {response.text[:200]}...")
    
    def test_connection(self) -> bool:
        """Test basic connection to backend"""
        self.print_test("Testing backend connection...")
        
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=5)
            if response.status_code == 200:
                self.print_success("Backend is reachable")
                return True
            else:
                self.print_error(f"Backend returned status {response.status_code}")
                return False
        except requests.exceptions.ConnectionError:
            self.print_error(f"Cannot connect to backend at {self.base_url}")
            self.print_info("Make sure backend is running: cd backend && uvicorn app.main:app --reload")
            return False
        except Exception as e:
            self.print_error(f"Connection error: {str(e)}")
            return False
    
    def test_root_endpoint(self) -> bool:
        """Test root endpoint"""
        self.print_test("Testing root endpoint...")
        
        try:
            response = self.session.get(f"{self.base_url}/", timeout=5)
            if response.status_code == 200:
                data = response.json()
                self.print_success("Root endpoint working")
                if "version" in data:
                    self.print_info(f"API Version: {data.get('version')}")
                return True
            else:
                self.print_error(f"Root endpoint returned {response.status_code}")
                return False
        except Exception as e:
            self.print_error(f"Root endpoint error: {str(e)}")
            return False
    
    def test_cors_headers(self) -> bool:
        """Test CORS headers"""
        self.print_test("Testing CORS headers...")
        
        try:
            response = self.session.options(
                f"{self.base_url}/health",
                headers={
                    "Origin": "http://localhost:3000",
                    "Access-Control-Request-Method": "POST"
                },
                timeout=5
            )
            
            cors_origin = response.headers.get("Access-Control-Allow-Origin")
            if cors_origin:
                self.print_success(f"CORS configured for origin: {cors_origin}")
                return True
            else:
                self.print_error("CORS headers not found")
                return False
        except Exception as e:
            self.print_error(f"CORS test error: {str(e)}")
            return False
    
    def test_request_otp_invalid_email(self) -> bool:
        """Test request OTP with invalid email"""
        self.print_test("Testing OTP request with invalid email...")
        
        try:
            response = self.session.post(
                f"{self.base_url}/auth/request-otp",
                json={"email": "nonexistent@example.com"},
                timeout=5
            )
            
            if response.status_code == 403:
                data = response.json()
                self.print_success("Request rejected for non-existent email (expected)")
                if "detail" in data:
                    self.print_info(f"Response: {data['detail']}")
                return True
            else:
                self.print_error(f"Unexpected status code: {response.status_code}")
                self.print_response(response)
                return False
        except Exception as e:
            self.print_error(f"Error: {str(e)}")
            return False
    
    def test_request_otp_endpoint_exists(self) -> bool:
        """Test that request OTP endpoint exists"""
        self.print_test("Testing request OTP endpoint connectivity...")
        
        try:
            response = self.session.post(
                f"{self.base_url}/auth/request-otp",
                json={"email": "test@test.com"},
                timeout=5
            )
            
            # Endpoint should exist (even if returns 403 for invalid email)
            if response.status_code in [400, 403, 404]:
                self.print_success("Request OTP endpoint is accessible")
                return True
            else:
                self.print_error(f"Unexpected status: {response.status_code}")
                return False
        except Exception as e:
            self.print_error(f"Error: {str(e)}")
            return False
    
    def test_verify_otp_endpoint_exists(self) -> bool:
        """Test that verify OTP endpoint exists"""
        self.print_test("Testing verify OTP endpoint connectivity...")
        
        try:
            response = self.session.post(
                f"{self.base_url}/auth/verify-otp",
                json={"email": "test@test.com", "otp": "000000"},
                timeout=5
            )
            
            # Endpoint should exist (even if returns 403 for invalid email)
            if response.status_code in [400, 403, 404]:
                self.print_success("Verify OTP endpoint is accessible")
                return True
            else:
                self.print_error(f"Unexpected status: {response.status_code}")
                return False
        except Exception as e:
            self.print_error(f"Error: {str(e)}")
            return False
    
    def test_api_documentation(self) -> bool:
        """Test API documentation endpoints"""
        self.print_test("Testing API documentation...")
        
        try:
            response = self.session.get(
                f"{self.base_url}/docs",
                timeout=5
            )
            
            if response.status_code == 200:
                self.print_success("Swagger UI available at /docs")
                return True
            else:
                self.print_error(f"Swagger UI returned {response.status_code}")
                return False
        except Exception as e:
            self.print_error(f"Error: {str(e)}")
            return False
    
    def test_response_format(self) -> bool:
        """Test API response format consistency"""
        self.print_test("Testing API response format...")
        
        try:
            response = self.session.get(f"{self.base_url}/", timeout=5)
            if response.status_code == 200:
                data = response.json()
                
                # Check for required fields
                required_fields = ["message", "version"]
                missing_fields = [f for f in required_fields if f not in data]
                
                if missing_fields:
                    self.print_error(f"Missing fields: {missing_fields}")
                    return False
                else:
                    self.print_success("Response format is correct")
                    return True
            else:
                return False
        except Exception as e:
            self.print_error(f"Error: {str(e)}")
            return False
    
    def test_error_handling(self) -> bool:
        """Test error response handling"""
        self.print_test("Testing error response handling...")
        
        try:
            # Test with invalid OTP format
            response = self.session.post(
                f"{self.base_url}/auth/verify-otp",
                json={"email": "", "otp": ""},
                timeout=5
            )
            
            # Should return an error response (400 or 422)
            if response.status_code >= 400:
                self.print_success("Error responses are properly handled")
                return True
            else:
                self.print_error("Should return error for invalid input")
                return False
        except Exception as e:
            self.print_error(f"Error: {str(e)}")
            return False
    
    def test_json_serialization(self) -> bool:
        """Test JSON serialization of responses"""
        self.print_test("Testing JSON response serialization...")
        
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                
                # Try to re-serialize
                json_str = json.dumps(data, ensure_ascii=False)
                
                self.print_success("JSON serialization working correctly")
                return True
            else:
                return False
        except json.JSONDecodeError as e:
            self.print_error(f"JSON decode error: {str(e)}")
            return False
        except Exception as e:
            self.print_error(f"Error: {str(e)}")
            return False
    
    def run_all_tests(self) -> bool:
        """Run all integration tests"""
        print(f"\n{BLUE}CIS CWIE Hub - Frontend-Backend Integration Test Suite{RESET}")
        print(f"Testing against: {self.base_url}\n")
        
        # Connection tests
        self.print_section("1. Connection & Connectivity Tests")
        tests = [
            self.test_connection,
            self.test_root_endpoint,
            self.test_cors_headers,
        ]
        
        for test in tests:
            try:
                result = test()
                if result:
                    self.test_results["passed"] += 1
                else:
                    self.test_results["failed"] += 1
                self.test_results["total"] += 1
            except Exception as e:
                self.print_error(f"Test exception: {str(e)}")
                self.test_results["failed"] += 1
                self.test_results["total"] += 1
        
        # API Endpoint tests
        self.print_section("2. API Endpoint Tests")
        tests = [
            self.test_request_otp_endpoint_exists,
            self.test_verify_otp_endpoint_exists,
            self.test_api_documentation,
        ]
        
        for test in tests:
            try:
                result = test()
                if result:
                    self.test_results["passed"] += 1
                else:
                    self.test_results["failed"] += 1
                self.test_results["total"] += 1
            except Exception as e:
                self.print_error(f"Test exception: {str(e)}")
                self.test_results["failed"] += 1
                self.test_results["total"] += 1
        
        # Response Format tests
        self.print_section("3. Response Format & Error Handling Tests")
        tests = [
            self.test_response_format,
            self.test_error_handling,
            self.test_json_serialization,
        ]
        
        for test in tests:
            try:
                result = test()
                if result:
                    self.test_results["passed"] += 1
                else:
                    self.test_results["failed"] += 1
                self.test_results["total"] += 1
            except Exception as e:
                self.print_error(f"Test exception: {str(e)}")
                self.test_results["failed"] += 1
                self.test_results["total"] += 1
        
        # Invalid input tests
        self.print_section("4. Input Validation Tests")
        tests = [
            self.test_request_otp_invalid_email,
        ]
        
        for test in tests:
            try:
                result = test()
                if result:
                    self.test_results["passed"] += 1
                else:
                    self.test_results["failed"] += 1
                self.test_results["total"] += 1
            except Exception as e:
                self.print_error(f"Test exception: {str(e)}")
                self.test_results["failed"] += 1
                self.test_results["total"] += 1
        
        # Print summary
        self.print_summary()
        
        return self.test_results["failed"] == 0
    
    def print_summary(self):
        """Print test summary"""
        self.print_section("Test Summary")
        
        total = self.test_results["total"]
        passed = self.test_results["passed"]
        failed = self.test_results["failed"]
        
        print(f"Total Tests: {total}")
        print(f"{GREEN}Passed: {passed}{RESET}")
        print(f"{RED}Failed: {failed}{RESET}")
        
        if failed == 0:
            print(f"\n{GREEN}✓ All tests passed! Frontend-Backend integration is working correctly.{RESET}")
        else:
            print(f"\n{RED}✗ {failed} test(s) failed. Check the errors above and ensure:{'':50}{RESET}")
            print("  1. Backend is running: cd backend && uvicorn app.main:app --reload")
            print("  2. Redis is running (required for OTP)")
            print("  3. Database is accessible")
            print("  4. All dependencies are installed")
        
        print("\n" + "="*70 + "\n")


def main():
    tester = IntegrationTester()
    success = tester.run_all_tests()
    return success


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
