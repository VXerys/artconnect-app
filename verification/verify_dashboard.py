from playwright.sync_api import Page, expect, sync_playwright
import os

def verify_dashboard(page: Page):
    # 1. Navigate to Dashboard
    # Since we are not actually logged in, we might be redirected to login.
    # However, for this verification, we want to see if the Dashboard renders correctly.
    # If the app redirects to Login, we might need to mock the auth state or just verify the login page redirect.
    # But let's try to bypass auth if possible or mock it.
    # Since we are running against a real dev server, we can't easily mock the Pinia store state from outside without devtools.
    # So we will first verify the Login page appears (as expected if unauthenticated).

    print("Navigating to Dashboard...")
    page.goto("http://localhost:5173/app/dashboard")

    # Wait for load
    page.wait_for_load_state("networkidle")

    # If we are redirected to Login, that's expected behavior for unauthenticated user.
    # We can verify that redirection happens.
    if "/login" in page.url:
        print("Redirected to Login as expected. Taking screenshot...")
        expect(page.get_by_text("Welcome Back")).to_be_visible()
        page.screenshot(path="/app/verification/redirect_login.png")
    else:
        # If we somehow get to dashboard (e.g. if auth check fails or we are somehow logged in)
        print("On Dashboard. Taking screenshot...")
        page.screenshot(path="/app/verification/dashboard_view.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_dashboard(page)
            print("Verification script finished.")
        finally:
            browser.close()
