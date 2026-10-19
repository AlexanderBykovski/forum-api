import { createApp } from "./app.js"

const app = createApp()
const PORT = 8000
const HOST = 'localhost'

app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
});
