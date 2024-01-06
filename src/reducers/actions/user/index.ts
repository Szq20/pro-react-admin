export const actionType = {
    DETAIL: 'DETAIL',
    UPDATE: 'UPDATE'
};

export const user = (payload) => ({
    type: actionType.DETAIL,
    payload
});
