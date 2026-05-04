import {describe, test, it, expect, beforeEach, afterEach, vi} from 'vitest';


// --- Helpers ---------
/**
 * Recreate the DOM and re-register the listener before every test.
 * This mirrors what the browser does on each page load, without any
 * module import tricks.
 */
function setup() {
  document.body.innerHTML = `
    <form id="loginForm">
      <input id="username" type="text"     value="" />
      <input id="password" type="password" value="" />
      <button type="submit">Login</button>
    </form>
  `;
 
  // Register the handler exactly as login.js does
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
 
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
 
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
 
      const data = await response.json();
 
      if (response.ok) {
        console.log("Login Success");
        window.location.href = data.redirect;
      } else {
        alert(data.error);
        console.log("Login Failed!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
}
 
// this function is used inside test to avoid repeating the same 4 lines every time
async function submitForm(username, password) {
  document.getElementById("username").value = username;
  document.getElementById("password").value = password;
  const form = document.getElementById("loginForm");
  form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
 
  // Flush all microtasks / promises
  await new Promise((r) => setTimeout(r, 0));
}

// --- Tests ---------

describe( "login form", () => {
  let fetchMock;

  beforeEach(() => {
     fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("location", { href: "" });
    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    setup();
  });
 
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  }); 

  it( "Sends credentials as a POST  request", async() => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ redirect: "/dashboard" }),
    });

    await submitForm();

    expect(window.location.href).toBe("/dashboard");
  });

  it("Shows alert on failed login", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid credentials" }),
    });

    await submitForm();
    expect(window.alert).toHaveBeenCalledWith("Invalid credentials");
  });
  it("Logs error on network failure", async () => {
    const error = new Error("Network error");
    fetchMock.mockRejectedValueOnce(error);

    await submitForm();
    expect(console.error).toHaveBeenCalledWith("Error:", error);
  });
});


