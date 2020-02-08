import axios from 'axios';

export const createReport = (id, reason, reportedRef) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = {
      reason,
      reportedRef
    };

    const res = await axios.post(`/api/report/${id}`, body, config);
  } catch (err) {
    console.log('err');
    console.log(err);
  }
};
