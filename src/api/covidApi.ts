import finnishCoronaDataV2 from '../resources/finnishCoronaDataV2.json';
import hcdTestData from '../resources/hcdTestData.json';
import thlTestData from '../resources/thlTestData.json';

export class CovidApi {
    getFinnishCoronaData = async (): Promise<any> => {
        try {
            if (process.env.REACT_APP_USE_LIVE_DATA_API === 'true') {
                const res = await fetch('https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData/v2')
                return res.json()
            } else {
                return finnishCoronaDataV2;
            }
        } catch (error) {
            console.error(error)
        }
    }

    getHcdTestData = async (): Promise<any> => {
        try {
            if (process.env.REACT_APP_USE_LIVE_DATA_API === 'true') {
                const res = await fetch('https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/hcdTestData')
                return res.json()
            } else {
                return hcdTestData;
            }
        } catch (error) {
            console.error(error)
        }
    }

    getThlTestData = async (): Promise<any> => {
        try {
            if (process.env.REACT_APP_USE_LIVE_DATA_API === 'true') {
                const res = await fetch('https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/thlTestData')
                return res.json()
            } else {
                return thlTestData;
            }
        } catch (error) {
            console.error(error)
        }
    }
}
