import apiClient from "./client";

const scan = (file) => {
    return apiClient.get(`/scan/${file}/`);
}

const checkResults = ({ access_token, scan_id }) => {
    return apiClient.get(`results/${scan_id}/${access_token}`);
}

export default {
    scan,
    checkResults
}