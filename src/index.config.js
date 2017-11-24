import SailsDisk from 'sails-disk'

//SailsDisk.registerDatastore = SailsDisk.registerConnection
//SailsDisk.registerConnection = undefined

export default {
    adapters: {
        disk: SailsDisk
    },
    datastores: {
        default: {
            adapter: 'disk'
        }
    }
}