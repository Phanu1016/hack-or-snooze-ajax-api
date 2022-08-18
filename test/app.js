const BASE = "https://hack-or-snooze-v3.herokuapp.com"
async function getStories(){
    const response = await axios({
        url: `${BASE}/stories`,
        method: "GET"
    })
    return response.data
}
