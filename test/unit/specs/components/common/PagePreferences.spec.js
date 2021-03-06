import setup from "../../../helpers/vuex-setup"
import PagePreferences from "renderer/components/common/PagePreferences"
jest.mock("renderer/google-analytics.js", () => uid => {})

describe("PagePreferences", () => {
  let wrapper, store
  let instance = setup()

  beforeEach(async () => {
    let test = instance.mount(PagePreferences)
    wrapper = test.wrapper
    store = test.store

    await store.dispatch("signIn", {
      account: "default",
      password: "1234567890"
    })
  })

  it("has the expected html structure if connected", () => {
    expect(wrapper.vm.$el).toMatchSnapshot()
    expect(wrapper.vm.$el.outerHTML).toContain("Select network")
    expect(wrapper.vm.$el.outerHTML).toContain("Select theme")
    expect(wrapper.vm.$el.outerHTML).toContain("View tutorial")
    expect(wrapper.vm.$el.outerHTML).toContain("Automatically send")
    expect(wrapper.vm.$el.outerHTML).toContain("Switch account")
    expect(wrapper.vm.$el.outerHTML).toContain("Sign Out")
  })

  it("should sign the user out", async () => {
    wrapper.vm.signOut()
    expect(store.dispatch).toHaveBeenCalledWith("signOut")
    expect(store.commit).toHaveBeenCalledWith("notifySignOut")
  })

  it("should set the error collection opt in", async () => {
    let errorCollection = wrapper.vm.user.errorCollection
    wrapper.vm.setErrorCollection()
    expect(store.dispatch).toHaveBeenCalledWith("setErrorCollection", {
      account: "default",
      optin: !errorCollection
    })
    expect(wrapper.vm.user.errorCollection).not.toBe(errorCollection)
  })

  it("can switch the theme", () => {
    wrapper.vm.setAppTheme()
    expect(store.commit).toHaveBeenCalledWith("setTheme", "light")
    expect(store.state.themes.active).toBe("light")
    // store.commit.mockClear()
    wrapper.vm.setAppTheme()
    expect(store.commit).toHaveBeenCalledWith("setTheme", "dark")
    expect(store.state.themes.active).toBe("dark")
  })

  it("can show onboarding again", () => {
    wrapper.find("#toggle-onboarding").trigger("click")
    expect(store.commit).toHaveBeenCalledWith("setOnboardingState", 0)
    expect(store.commit).toHaveBeenCalledWith("setOnboardingActive", true)
    wrapper.update()
    expect(wrapper.find("#onboarding")).toBeDefined()
  })

  it("switches mocked mode", () => {
    wrapper.vm.networkSelectActive = "mock"
    wrapper.vm.setMockedConnector()
    expect(store.dispatch).toHaveBeenCalledWith("setMockedConnector", true)
  })
})
