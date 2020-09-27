export class CovidApi {
    getFinnishCoronaData = async (): Promise<any> => {
        try {
            const res = await fetch('https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData/v2')
            return res.json()
        } catch (error) {
            console.error(error)
        }
    }

    getHcdTestData = async (): Promise<any> => {
        try {
            const res = await fetch('https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/hcdTestData')
            return res.json()
        } catch (error) {
            console.error(error)
        }
    }

    getThlTestData = async (): Promise<any> => {
        try {
            const res = await fetch('https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/thlTestData')
            return res.json()
        } catch (error) {
            console.error(error)
        }
    }
}
