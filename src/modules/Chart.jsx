import { useEffect, useState } from 'react'
import { API_URL, FIFTEEN_MINUTES } from '../utils/utils'
import { LineChart } from '@mui/x-charts/LineChart';
import { format } from 'date-fns';

const MAX_SIZE_SLICE = 10;

const Chart = () => {
    const [data, setData] = useState([]);
    const [counter, setCounter] = useState(0);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        async function fetchData() {
            setLoading(true);
            const response = await fetch(API_URL);
            const responseData = await response.json();
            setData(responseData);
            setLoading(false);
           

        }

        fetchData();

        const intervalFn = setInterval(() => {
            fetchData();
            setCounter((previousValue) => previousValue + 1)
        }, FIFTEEN_MINUTES)

        return () => clearInterval(intervalFn);
    }, [])
    
    return (
        <>
            {loading ? null : <LineChart
                height={300}

                series={data.map((d, index) => (
                    { data: d.minutely_15.temperature_2m.slice(counter, counter + MAX_SIZE_SLICE), label: "Ciudad " + (index + 1) }
                ))}
                xAxis={[{ scaleType: 'point', data: data[0].minutely_15.time.slice(counter, counter + MAX_SIZE_SLICE).map(time => format(new Date(time), "dd/MM HH:mm")) }]}
                yAxis={[{ width: 50 }]}

            />}
        </>

    )
}

export default Chart