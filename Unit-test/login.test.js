/** @jest-environment jsdom */
 
const nav = { go(url) { window.location.href = url; } };
 
function renderLoginPage(container) {
  container.innerHTML = `
    <form id="loginForm">
      <h2>Welcome back</h2>
      <input id="username" type="text" /><input id="password" type="password" />
      <input type="checkbox" checked />
      <button type="submit" class="btn-primary">Login</button>
      <button id="registerButton" type="button">Create account</button>
    </form>`;
  document.getElementById("registerButton").onclick = () => nav.go("/register");
}
 
function attachLoginHandler() {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: document.getElementById("username").value,
          password: document.getElementById("password").value,
        }),
      });
      const data = await res.json();
      if (res.ok) nav.go(data.redirect); else alert(data.error);
    } catch (err) { console.error("Error:", err); }
  });
}
 
const flush = () => new Promise((r) => setTimeout(r, 0));
const mockFetch = (ok, body) =>
  (global.fetch = jest.fn().mockResolvedValue({ ok, json: async () => body }));
const submit = () =>
  document.getElementById("loginForm")
    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
 
beforeEach(() => {
  document.body.innerHTML = `<div id="app"></div>`;
  renderLoginPage(document.getElementById("app"));
  attachLoginHandler();
  jest.spyOn(nav, "go").mockImplementation(() => {});
  jest.spyOn(window, "alert").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  document.getElementById("username").value = "alice";
  document.getElementById("password").value = "secret";
});
afterEach(() => { jest.restoreAllMocks(); global.fetch = undefined; });
 
test("renders heading, inputs, checkbox, and buttons", () => {
  expect(document.querySelector("h2").textContent).toBe("Welcome back");
  expect(document.getElementById("password").type).toBe("password");
  expect(document.querySelector('input[type="checkbox"]').checked).toBe(true);
  expect(document.querySelector(".btn-primary").textContent).toBe("Login");
});
 
test("Create account navigates to /register", () => {
  document.getElementById("registerButton").click();
  expect(nav.go).toHaveBeenCalledWith("/register");
});
 
test("POSTs credentials as JSON", async () => {
  mockFetch(true, { redirect: "/" }); submit(); await flush();
  expect(fetch).toHaveBeenCalledWith("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "alice", password: "secret" }),
  });
});
 
test("navigates on success, no alert", async () => {
  mockFetch(true, { redirect: "/dashboard" }); submit(); await flush();
  expect(nav.go).toHaveBeenCalledWith("/dashboard");
  expect(window.alert).not.toHaveBeenCalled();
});
 
test("alerts error on failure, no navigation", async () => {
  mockFetch(false, { error: "Invalid credentials" }); submit(); await flush();
  expect(window.alert).toHaveBeenCalledWith("Invalid credentials");
  expect(nav.go).not.toHaveBeenCalled();
});
 
test("logs error on network failure, no alert or navigation", async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error("fail"));
  submit(); await flush();
  expect(console.error).toHaveBeenCalledWith("Error:", expect.any(Error));
  expect(window.alert).not.toHaveBeenCalled();
  expect(nav.go).not.toHaveBeenCalled();
});
 
test("prevents default form submission", async () => {
  mockFetch(true, { redirect: "/" });
  const e = new Event("submit", { bubbles: true, cancelable: true });
  jest.spyOn(e, "preventDefault");
  document.getElementById("loginForm").dispatchEvent(e);
  await flush();
  expect(e.preventDefault).toHaveBeenCalled();
});