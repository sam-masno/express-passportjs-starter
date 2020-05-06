
module.exports = (token) => {
    return `
        <html>
            <body>
                <div style="text-align: center">
                    <h3> Click the link below to verify your account at International School Hub </h3>
                    <a href="http://localhost:3000/verify/${token}">http://localhost:3000/verify/${token}</a>
                </div>
            </body>
        </html>
    `
}