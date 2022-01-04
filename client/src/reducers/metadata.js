const metadataDefaultState = {
    participantID: ''
};

export default (state = metadataDefaultState, action) => {
    switch(action.type) {
        case 'PARTICIPANT_ID':
            return {
                ...state,
                participantID: action.participantID
            };
    }
};