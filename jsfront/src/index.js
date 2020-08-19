document.addEventListener('DOMContentLoaded', (e) => {

    let success = false 
    while (!success) {
        success = login() 
        return success
    }
}) 

const login = () => { 
    let return_value = false 
    let loginForm = document.getElementById('login-form') 
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault() 

        fetch('http://localhost:3000/users') 
        .then(res => res.json()) 
        .then(json => {
            let foundUser

            json.forEach(user => {
                if (user.name === e.target[0].value) {
                    let landingDiv = document.getElementById('landing') 
                    foundUser = user 
                    return_value = true
                    landingDiv.innerText = `Login successful, welcome ${user.name}.`
                    findAppointments(user) // finds matching appts with user 
                    
                    let form = document.getElementById('form')
                    form.addEventListener('submit', (e) => {
                         e.preventDefault()
                         addAppointment(e, user)
                        
                        })
                    }
                })
            if (!foundUser) {
                let error = document.getElementById('login-error')
                error.innerText = "" 
                error.innerText = "Sorry, name is not found. Please try again or sign up."
                loginForm.reset()
            }

            else {
                let landingDiv = document.getElementById('landing') 

                // landingDiv.style.display = "none"
                // renderHomePage(foundUser)
            }
        })

    })


//Sign up 
    let signupForm = document.getElementById("signup-form")
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault()
        
        if (e.target[0].value === e.target[1].value){
            let data = {
                name: e.target[1].value
            }
            fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(json => {

                let landingDiv = document.getElementById("landing")
                landingDiv.innerText = `Sign up successful, welcome ${name}.`
                return_value = true
            })
        }
        else {
            let error = document.getElementById("login-error")
            error.innerText = ""
            error.innerText = "Sorry, names do not match. Please try again."
            loginForm.reset()
        }
    })
    return return_value
}

const findAppointments = (user) => {

    fetch(`http://localhost:3000/appointments`)
    .then(res => res.json())
    .then(json => {
        let render = false 
        json.forEach(appointment => {
            if (appointment.user_id == user.id) {
                fetch(`http://localhost:3000/appointments/${appointment.id}`)
                .then(res => res.json())
                .then(json => {
                    renderAppointments(json, user) // puts appts onto appointment list 

                })
            }
        })
    })
}

const renderAppointments = (json, user) => {
    // debugger
    let div = document.getElementById('upcoming-appointments')
    let appointment = document.createElement('ul')
    appointment.id = json.id
    appointment.innerHTML = `${json.date} with Provider ${json.provider_id}` 
    div.appendChild(appointment)

    let editAppointmentButton = document.createElement('button') 
    editAppointmentButton.className='edit-appointment-button'
    editAppointmentButton.id = `${json.id}`
    editAppointmentButton.innerHTML = 'Edit'
    appointment.appendChild('editAppointmentButton')


    editAppointmentButton.addEventListener('click', (e) => console.log(e))

}


const addAppointment = (e, user) => {
    let data = {
        date: e.target[0].value,
        note: e.target[2].value,
        provider_id: e.target[1].value,
        user_id: user.id
    }

    fetch(`http://localhost:3000/appointments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },

    body: JSON.stringify(data)
    })
    .then(res => res.json())

    // .then(res => console.log(res))
}



//     fetch(`http://localhost:3000/appointments`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
    
//         }, 
//         body: JSON.stringify(data)
//     })

    // .then(res => res.json())
    // .then (res => {
    //     let appointmentList = document.getElementById('appointment-list')
    //     let addedAppointment = document.createElement('ul')
    //     // addedAppointment.innerText = `${e.target[0].value}`
    //     // addedAppointment.id = `${appointment.id}`
    //     // appointmentList.appendChild(addedAppointment)
    // })

// }
