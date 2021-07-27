import { create } from 'apisauce'

const apiClient = create({
    baseURL: 'http://plagiarismchecker.pythonanywhere.com/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
