import axios from "axios";

let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1NzU1MzAzMjEsImV4cCI6MTU3NTU2NjMyMSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImVtYWlsIjoiYWRtaW4xQGdydXBhZGVhbGVyLnBsIiwiY29udGV4dCI6ImIxMTJiOTUzLTExYzgtNGQ0Yi05YWRmLTY1ZTU5ZGViMDNiNSIsInV1aWQiOiI1OGYyYWRhMS00YTdiLTQ5ZTEtOGU4Mi00YTY5ZjI0ZDQ3YWYiLCJob3N0IjoiaHR0cDpcL1wvbG9jYWxob3N0OjgxMDAifQ.MhKUvfaH6qMaroU--yDcOCJs613x2Ur_wQg2tCx0z1iVIj9RRtZCJN6AJZzqRSz2jMh4jPEDBhV3gQ_Tj4Ocz1d7xe2nS_UE4ODyJLPBZq9KWZP6sTKYBkMq58Mzrjd1t8yiNZz20g_iyuqyyieNdbZiggO6q7ffWZ9Eq3YXTYaFIGHcWugPVENnlmvh6PpRYZagEhbaqe_jiKIVgFrxKv-q_m3W2d7SblqZ_N6p7IcFeTUPQ7iDcSyjVAHVvHD9mjz2DdeCGRQaJeptwIX3_la2BSB-hKyhfCPI9VakQW1gGwYpCSVrL8vVe-DUuUnM9H76NgVXsLKvU91GcahFBhzB5A9jdgNtgA0vMJLpeYplMvx-XrsSP-nEl-716h4b0KApFhY-pLT6C_-lSrvUq1CNXJTo94yumRAPDrc_KixR48uDvvtFpRWDnO3Y02aHRxmzczKg-5mOrBfFqXpwYoQbcZAagZZ4zzHoZ6td6J5Y3kPNxh9opttupy0JRiBJDFtsV8KJ9xEKyxaZh4WiuTpt0b96iFPYQiF0LRqIiaOQxKwcgiefxr4kToRTF5aAqmVwQWVawD1BuEBoHZWuOR6SUc4eaBKqtZJVXG6Dn0k2EnNwwKpCpR64FvQdRvKkJ9GR4WdJ4tfYSXvyKtMYfpkOA_vaFOdv18gm9O8eoK8';

let client = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    common: {
      Authorization: 'Bearer '.concat(token)
    }
  }
});

export default client;