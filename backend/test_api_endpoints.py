"""
Test script for CIS CWIE Hub API endpoints
This verifies that all endpoints are properly connected and responding
"""

import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8000"

# Colors for console output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"


def print_section(title: str):
    """Print section header"""
    print(f"\n{BLUE}{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}{RESET}\n")


def print_success(message: str):
    """Print success message"""
    print(f"{GREEN}✓ {message}{RESET}")


def print_error(message: str):
    """Print error message"""
    print(f"{RED}✗ {message}{RESET}")


def print_warning(message: str):
    """Print warning message"""
    print(f"{YELLOW}⚠ {message}{RESET}")


def test_endpoint(method: str, path: str, name: str, data: Dict[str, Any] = None, headers: Dict[str, str] = None) -> bool:
    """
    Test a single endpoint
    
    Args:
        method: HTTP method (GET, POST, etc.)
        path: API path
        name: Test name for display
        data: Request body data
        headers: Custom headers
    
    Returns:
        bool: True if test passed, False otherwise
    """
    url = f"{BASE_URL}{path}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers, timeout=5)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=5)
        else:
            print_error(f"Unsupported method: {method}")
            return False
        
        status_code = response.status_code
        
        # Check if response is successful (2xx)
        if 200 <= status_code < 300:
            print_success(f"{name} ({method} {path}) - Status {status_code}")
            return True
        else:
            print_error(f"{name} ({method} {path}) - Status {status_code}")
            print(f"  Response: {response.text[:200]}")
            return False
            
    except requests.exceptions.ConnectionError:
        print_error(f"Connection error for {name} - Backend not running at {BASE_URL}")
        return False
    except requests.exceptions.Timeout:
        print_error(f"Timeout for {name}")
        return False
    except Exception as e:
        print_error(f"Error testing {name}: {str(e)}")
        return False


def main():
    """Run all API endpoint tests"""
    print(f"\n{BLUE}CIS CWIE Hub - API Endpoint Test Suite{RESET}")
    print(f"Testing against: {BASE_URL}\n")
    
    results = {
        "passed": 0,
        "failed": 0,
        "total": 0
    }
    
    # Test 1: Health Check
    print_section("1. Health Check & Root Endpoints")
    
    if test_endpoint("GET", "/", "Root endpoint"):
        results["passed"] += 1
    else:
        results["failed"] += 1
    results["total"] += 1
    
    if test_endpoint("GET", "/health", "Health check"):
        results["passed"] += 1
    else:
        results["failed"] += 1
    results["total"] += 1
    
    # Test 2: Authentication Endpoints
    print_section("2. Authentication Endpoints")
    
    # Test request OTP (without valid email from DB - should fail with 403)
    if test_endpoint(
        "POST",
        "/auth/request-otp",
        "Request OTP endpoint (connectivity)",
        {"email": "test@example.com"}
    ):
        # This endpoint should exist and respond (even if 403 due to email not in DB)
        results["passed"] += 1
    else:
        results["failed"] += 1
    results["total"] += 1
    
    # Test verify OTP endpoint
    if test_endpoint(
        "POST",
        "/auth/verify-otp",
        "Verify OTP endpoint (connectivity)",
        {"email": "test@example.com", "otp": "000000"}
    ):
        results["passed"] += 1
    else:
        results["failed"] += 1
    results["total"] += 1
    
    # Test 3: Documentation
    print_section("3. API Documentation")
    
    if test_endpoint("GET", "/docs", "Swagger UI"):
        results["passed"] += 1
    else:
        results["failed"] += 1
    results["total"] += 1
    
    if test_endpoint("GET", "/redoc", "ReDoc"):
        results["passed"] += 1
    else:
        results["failed"] += 1
    results["total"] += 1
    
    # Test 4: CORS Headers
    print_section("4. CORS Configuration")
    
    try:
        response = requests.options(
            f"{BASE_URL}/health",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET"
            },
            timeout=5
        )
        
        cors_origin = response.headers.get("Access-Control-Allow-Origin")
        cors_methods = response.headers.get("Access-Control-Allow-Methods")
        cors_headers = response.headers.get("Access-Control-Allow-Headers")
        
        if cors_origin:
            print_success(f"CORS Allow-Origin: {cors_origin}")
        else:
            print_warning("CORS Allow-Origin header not found")
        
        if cors_methods:
            print_success(f"CORS Allow-Methods: {cors_methods}")
        else:
            print_warning("CORS Allow-Methods header not found")
            
    except Exception as e:
        print_error(f"CORS test failed: {str(e)}")
    
    # Summary
    print_section("Test Summary")
    
    total = results["total"]
    passed = results["passed"]
    failed = results["failed"]
    
    print(f"Total Tests: {total}")
    print(f"{GREEN}Passed: {passed}{RESET}")
    print(f"{RED}Failed: {failed}{RESET}")
    
    if failed == 0:
        print(f"\n{GREEN}All tests passed! API endpoints are properly configured.{RESET}")
    else:
        print(f"\n{RED}{failed} test(s) failed. Please check the errors above.{RESET}")
    
    return failed == 0


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
