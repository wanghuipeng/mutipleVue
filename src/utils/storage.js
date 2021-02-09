const getSession = (name) => {
    return window.sessionStorage.getItem(name)
}

const setSession = (name, value) => {
    window.sessionStorage.setItem(name, value)
}

const removeSessionItem = (key) => {
    window.sessionStorage.removeItem(key)
}

const clearSessionAll = () => {
    window.sessionStorage.clear()
}

const getLocation = (name) => {
    return localStorage.getItem(name)
}

const setLocation = (name, value) => {
    localStorage.setItem(name, value)
}

const removeLocationItem = (key) => {
    window.localStorage.removeItem(key)
}

const clearLocationAll = () => {
    window.localStorage.clear()
}

export default {
    getSession,
    setSession,
    removeSessionItem,
    clearSessionAll,
    getLocation,
    setLocation,
    removeLocationItem,
    clearLocationAll
}