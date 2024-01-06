import rootAction from '@src/reducers/actions';

const initialState = {
    'id': '',
    'name': '',
    'phone': '',
    'age': undefined,
    'description': '',
    'role': ''
};

const inReducer = (state = initialState, {type = '', payload = undefined} = {}) => {
    switch (type) {
        case rootAction.user.actionType.DETAIL:
            return {...state};
        default:
            return state;
    }
};

export default inReducer;
