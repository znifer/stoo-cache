import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Select from "react-dropdown-select";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const Stats = () => {

    const [options, setOptions] = useState()
    const [currentTarget, setCurrentTarget] = useState()
    const [chartData, setChartData] = useState()

    const fetchData = async () => {
        return await axios.get("http://localhost:8000/api/review_target/")
    }

    const fetchChartData = async (id) => {
        return await axios.get(`http://localhost:8000/api/chart_data/?target=${id}`)
    }

    useEffect(() => {
        fetchData().then(res => setOptions(res.data))
    }, [])

    useEffect(() => {
        if (currentTarget === undefined) return
        fetchChartData(currentTarget.id).then(res => setChartData(res.data))
    }, [currentTarget])

    const parseData = () => {
        let result = []
        chartData.forEach(el => {
            let t = result.find((element, index, array) => {
                if (element.date === el.date) {
                    return true
                }
                return false
            })
            if (t === undefined) {
                result.push({
                    date: el.date,
                    rating: [el.rating]
                })
            } else {
                t.rating.push(el.rating)
            }

        });
        result.forEach(el => {
            const sum = el.rating.reduce((a, b) => a + b, 0)
            const avg = (sum / el.rating.length) || 0
            el.rating = avg
            const day = el.date.substring(8, 10)
            const month = el.date.substring(5, 7)
            el.date = `${day}.${month}`
        })
        result.sort((a, b) => {
            const ad = a.date
            const bd = b.date
            
            if (parseInt(ad.substring(2, 4)) == parseInt(bd.substring(2, 4))) {
                return parseInt(ad.substring(2, 4)) - parseInt(bd.substring(2, 4))
            } else {
                return parseInt(ad.substring(0, 2)) - parseInt(bd.substring(0, 2))
            }
        })
        console.log(result)
        return result
    }

    const renderChart = () => {
        if (chartData === undefined) return
        const data = parseData()
        return (
            <ResponsiveContainer width="99%" aspect={3}>
                <LineChart  height={400} data={data} margin={{ top: 5, right: 70, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="rating" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="date" />
                    <YAxis />
                </LineChart>
            </ResponsiveContainer>

        )
    }

    if (options) {
        return (
            <div className="container p-5">
                <div className="container px-5 py-3" id="chart-container">
                    <Select
                        labelField={"name"}
                        searchable
                        values={[]}
                        options={options}
                        onChange={(value) => setCurrentTarget(value[0])}
                        searchBy={"name"}
                    />
                    <div className="container py-3">
                        {renderChart()}
                    </div>


                </div>

            </div>
        )
    } else {
        return <div></div>
    }
}

export default Stats