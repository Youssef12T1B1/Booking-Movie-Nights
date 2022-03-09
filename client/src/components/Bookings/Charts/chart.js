import React from "react";
import {Bar} from 'react-chartjs'

const Buckets ={
    Cheap: {
        min : 1,
        max : 20
    },
    Normal: {
        min : 20,
        max : 99
    },
    Expensive: {
        min : 99,
        max : 1000
    },

}

const Bookchart = props=>{
    const  Chartdata = {labels : [], datasets: [] }
    let values =[]
    for (const Bucket in Buckets ){
        const BookCount = props.bookings.reduce((prev, current)=>{
          if( current.event.price > Buckets[Bucket].min && current.event.price < Buckets[Bucket].max){
            return prev +1
          }else{
              return prev
          }
           

        },0)
        values.push(BookCount)  
        Chartdata.labels.push(Bucket)
        Chartdata.datasets.push({
          
            data: values,
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
           
        })
        values = [...values]
        values[values.length -1] = 0

    }
 
    return   <center><Bar data={Chartdata} /></center> 
}

export default Bookchart