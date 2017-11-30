export function NullParamError(message) {
    this.name = this.constructor.name
    this.mesage = message || ''
}

export function GenericError(name, message) {
    this.name = name || this.constructor.name
    this.mesage = message || ''
}

export default (name) => {
    return (message) => {
        return new GenericError(name, message)
    }
}