const modzy = require("@modzy/modzy-sdk");
const modzyClient = new modzy.ModzyClient("https://app.modzy.com/api", "kxG5WbEfTO7KnOXiH1er.PePiyQlmAnI1YSkX3eQO")
let sources = {};
const sentimentAnaJob = async function getTextSum(text) {
    sources["my-input"] = {
        "input.txt": text
    };
    return new Promise(resolve => {
        modzyClient
            .submitJobText("ed542963de", "1.0.1", sources)
        .then(
            (job) => {
                resolve({ status: 200, job: job });
            }
        )
        .catch(
            (error) => {
                console.error("Modzy job submission failed with code " + error.code + " and message " + error.message);
                resolve({ status: 400, message: error.message })
            }
        );
    })
};

async function getSentimentAnalysis(text) {
    let data = await sentimentAnaJob(text);
    if (data.status == 400)
            resolve({ status: 400, message: data.message });
    let job = await modzyClient.blockUntilComplete(data.job);
    // return new Promise(resolve => {
        if (job.status === "COMPLETED") {
            let result = await modzyClient.getResult(job.jobIdentifier);
            console.log(`Result: finished:  ${result.finished}, total: ${result.total}, completed: ${result.completed}, failed: ${result.failed}`);

            for (key in sources) {
                // console.log(key);
                if (result.results && result.results[key]) {
                    // console.log(key);
                    let model_res = result.results[key]["results.json"];
                    console.log(JSON.stringify(model_res))
                    return { status: 200, output: model_res }
                }
                else {
                    return { status: 400, output: result.failures[key]['error'] }
                }
            }
        }
    // })
};
getSentimentAnalysis('Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware.')
module.exports=getSentimentAnalysis