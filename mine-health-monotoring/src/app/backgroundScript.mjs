import firestore from "../firebaseConfig.mjs";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

const trackUserData =  () => {
    console.log("Tracking User Data");
    const userCollection = collection(firestore, "users");

    onSnapshot(userCollection, (snapshot) => {
        snapshot.docChanges().forEach(async(change) => {

            let user = await prisma.user_helath_details.findFirst({
                where: {
                    emp_id: change.doc.id,
                }
            })
            
            if(!user) {
                await prisma.user_helath_details.create({
                    data: {
                        emp_id: change.doc.id,
                        spo2: change.doc.data().SPO2,
                        bpm: change.doc.data().BPM,
                    }
                })
            }else {
                await prisma.user_helath_details.update({
                    where: {
                        emp_id: change.doc.id,
                    },
                    data: {
                        emp_id: change.doc.id,
                        spo2: change.doc.data().SPO2,
                        bpm: change.doc.data().BPM,
                    }
                })
            }
        
            if (change.type === 'removed') {
                console.log('removed User: ', change.doc.data());
                await prisma.user_helath_details.update({
                    where: {
                        emp_id: change.doc.id,
                    },
                    data: {
                        emp_id: change.doc.id,
                        isDeleted: true,
                    }
                })   
            }

        })
        
    })       
}

// sesnor information 
const trackSensorInformation = () => {
    const sesnorCollection = collection(firestore, "sensors");

    onSnapshot(sesnorCollection,(snapshot) => {
        snapshot.docChanges().forEach(async(change) => {
           
           await prisma.sensor_information.create({
            data:{
                soil_sensor: change.doc.id == 'soil-moisture' ? change.doc.data().value : 0,
                noise_sensor: change.doc.id == 'noise-sensor' ? change.doc.data().value : 0,
            }
           })
           
        })
    })
}

trackUserData();
trackSensorInformation()