const modzy = require("@modzy/modzy-sdk");
const modzyClient = new modzy.ModzyClient("https://app.modzy.com/api", "kxG5WbEfTO7KnOXiH1er.PePiyQlmAnI1YSkX3eQO")
let sources = {};
const textSummarization = async function getTextSum(text) {
    sources["my-input"] = {
        "input.txt": text
    };
    return new Promise(resolve => {
        modzyClient
            .submitJobText("rs2qqwbjwb", "0.0.2", sources)
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

async function getSummarizedText(text) {
    let data = await textSummarization(text);
    if (data.status == 400)
            resolve({ status: 400, message: data.message });
    let job = await modzyClient.blockUntilComplete(data.job);
    // return new Promise(resolve => {
        if (job.status === "COMPLETED") {
            let result = await modzyClient.getResult(job.jobIdentifier);
            console.log(`Result: finished:  ${result.finished}, total: ${result.total}, completed: ${result.completed}, failed: ${result.failed}`);

            for (key in sources) {
                console.log(key);
                if (result.results && result.results[key]) {
                    console.log(key);
                    let model_res = result.results[key]["results.json"];
                    return { status: 200, output: model_res }
                    // console.log(`    ${key}: ${JSON.stringify(model_res)}`);
                }
                else {
                    return { status: 400, output: result.failures[key]['error'] }
                    console.log(`    ${key}: failure ${result.failures[key]['error']}`);
                    // resolve({ status: 400, message: result.failures[key]['error'] });
                }
            }
        }
    // })
};
// getSummarizedText('Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware.')
module.exports=getSummarizedText