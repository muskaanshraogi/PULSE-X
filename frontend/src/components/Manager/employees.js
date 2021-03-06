import React, { useEffect, useState } from 'react'
import { makeStyles, 
         TableContainer,
         Paper,
         Table,
         Card,
         TableHead,
         TableBody,
         TableRow,
         TableCell,
         Dialog,
         Button, 
         DialogTitle,
         DialogContent,
         TextField } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        marginTop: '27px',
        backgroundColor: theme.palette.background.paper,
        padding: '3% 7%'
    },
    button: {
        float: 'left',
        marginLeft: '10%'
    },
    textfield: {
        width: '100%',
        marginTop: '7%'
    },
    textfield2: {
        width: '49%',
        marginTop: '7%',
        marginRight: '1%'
    },
    registerButton: {
        margin: '3% 38%'
    },
    paper: {
        marginTop: '2%',
        padding: '2%'
    },
    alert: {
        width: '50%',
        float:'right',
        margin: '4% 0'
    },
    tablehead: {
        backgroundColor: '#ceceeb',
        color: '#ffffff'
    },
    tableDiv: {
        float: 'left',
        width: '100%',
        marginRight: '1%'
    },
    error: {
        color: '#ff0000'
    }
}))

function Profile(props) {

    let classes = useStyles()

    const [employees, setEmployees] = useState([])
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState(null)
    const [fname, setFname] = useState(null)
    const [lname, setLname] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirm, setConfirm] = useState(null)
    const [emailError, setEmailError] = useState(false)
    const [nameError, setNameError] = useState(false)
    const [passError, setPassError] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        getEmployees()
    }, [])

    const getEmployees = () => {
        axios({
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
            },
            url: `${process.env.REACT_APP_HOST}/api/manager/my_employees/`
        })
        .then((res) => {
            setEmployees(res.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const handleNewEmployee = (e) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(!email || !fname || !lname || !password || !confirm || password !== confirm || !re.test(email)) {
            if(!email || !re.test(email))
                setEmailError(true)
            if(!fname || !lname)
                setNameError(true)
            if(!password || !confirm || password !== confirm)
                setPassError(true)
        }
        else {

            axios({
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
                },
                data: {
                    "email": email,
                    "password": password,
                    "first_name": fname,
                    "last_name": lname
                },
                url: `${process.env.REACT_APP_HOST}/api/manager/login_employee/`
            })
            .then((res) => {
                setOpen(false)
                setSuccess(true)
                setTimeout(() => {
                    setSuccess(false)
                },5000)
                getEmployees()
            })
            .catch((error) => {
                if(error.response.status === 400)
                    window.alert('Email already exists!')
                else
                    window.alert('Something went wrong!')
            })
        }
    }

    const handleClose = (e) => {
        setOpen(false)
        setEmail(null)
        setFname(null)
        setLname(null)
        setPassword(null)
        setConfirm(null)
    }

    return (
        <div className={classes.root}>
            <div className={classes.tableDiv}>
                <div className='d-inline-flex'>
                    <Button
                    variant='contained'
                    color='primary'
                    onClick={(e) => { setOpen(true) }}
                    className={classes.button}
                    >
                        Add
                    </Button>
                </div>
                <TableContainer component={Paper} className={classes.paper}>
                    <Table className={classes.table}>
                        <TableHead className={classes.tablehead}>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.map((emp) => (
                                <TableRow key={emp.id}>
                                    <TableCell>
                                        <a href={`/manager/employees/${emp.id}`} className={classes.link}>
                                            {emp.first_name}&nbsp;{emp.last_name}
                                        </a>
                                    </TableCell>
                                    <TableCell>{emp.email}</TableCell>
                                    <TableCell>Employee</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Dialog
             open={open}
             onClose={handleClose}
            >
                <DialogTitle>Create New Employee</DialogTitle>
                <DialogContent>
                <TextField
                     variant='outlined'
                     label='First Name'
                     onChange={(e) => { 
                         setFname(e.target.value) 
                         setNameError(false)
                     }}
                     className={classes.textfield2}/>
                    <TextField
                     variant='outlined'
                     label='Last Name'
                     onChange={(e) => { 
                         setLname(e.target.value) 
                         setNameError(false)
                     }}
                     className={classes.textfield2}/>
                    { nameError ? <p className={classes.error}>Full name is required.</p> : null }
                    <TextField
                     variant='outlined'
                     label='Email'
                     onChange={(e) => { 
                         setEmail(e.target.value)
                         setEmailError(false) 
                     }}
                     className={classes.textfield}/>
                    { emailError ? <p className={classes.error}>Invalid email.</p> : null }
                    <TextField
                     variant='outlined'
                     label='Password'
                     type='password'
                     onChange={(e) => { 
                         setPassword(e.target.value)
                         setPassError(false)
                     }}
                     className={classes.textfield}/>
                    { passError ? <p className={classes.error}>Passwords do not match.</p> : null }
                    <TextField
                     variant='outlined'
                     label='Confirm Password'
                     type='password'
                     onChange={(e) => { 
                         setConfirm(e.target.value) 
                         setPassError(false)
                     }}
                     className={classes.textfield}/>
                    <Button
                     variant='contained'
                     color='primary'
                     disableElevation
                     onClick={handleNewEmployee}
                     className={classes.registerButton}
                    >
                        Register
                    </Button>
                </DialogContent>
            </Dialog>
            {
                success ?
                    <Alert 
                     severity='success' 
                     variant='filled'
                     className={classes.alert}
                    >
                        User registered successfully.
                    </Alert> :
                    null
            }
        </div>
    )
}

export default Profile