import SailsDisk from 'sails-disk'

export default {
    adapters: {
        disk: SailsDisk
    },
    connections: {
        disk: {
            adapter: 'disk'
        }
    }
}