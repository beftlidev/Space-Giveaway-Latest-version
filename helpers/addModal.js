module.exports = async (sourceInteraction, modal, timeout = 300000) => {
    await sourceInteraction.showModal(modal)
    return await sourceInteraction.awaitModalSubmit({
        time: timeout,
        filter: (filterInteraction) =>
            filterInteraction.customId === `modal-${sourceInteraction.id}`,
    })
}
