import {useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'

import api from '../../../services/api'

import LeaderBoardPodium from '../../../components/user/leaderboard/LeaderBoardPodium'
import LeaderBoardStats from '../../../components/user/leaderboard/LeaderBoardStats'
import LeaderBoardTable from '../../../components/user/leaderboard/LeaderBoardTable'

import './LeaderBoard.css'

function LeaderBoard(){
    const navigate=useNavigate()
    const [users,setUsers]=useState([])
    const [myRank,setMyRank]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")
    useEffect(()=>{
        loadLeaderBoard()
        loadMyRank()
    },[])
    const loadLeaderBoard=async ()=>{
        try{
            const response=await api.get(
                '/auth/leaderboard/'
            )
            setUsers(response.data.leaderboard)
        }catch(error){
            console.error(error)
            setError('unable to load leaderboard')
        }finally{
            setLoading(false)
        }
    }
    const loadMyRank=async ()=>{
        try{
            const response=await api.get(
                '/auth/leaderboard/my-rank/'
            )
            setMyRank(response.data)
        }catch(error){
            console.error(
                'unable to load your rank',
                error
            )
        }
    }
    const viewMyRank=()=>{
        if (!myRank) return
        const element=document.getElementById('leaderboard-table')
        if (element){
            element.scrollIntoView({
                behaviour:'smooth'
            })
        }
    }
    if (loading){
        return (
            <div className="container py-5 text-center">
                <div
                    className="spinner-border text-primary"
                    role="status"
                />
                <p className="mt-3">
                    Loading leaderboard...
                </p>
            </div>
        )
    }
    if (error){
        return (
            <div className="container py-5">

                <div className="alert alert-danger">
                    {error}
                </div>

            </div>
        )
    }
    return (
        <div className="leaderboard-page">

            <div className="container py-5">

                {/* Header */}

                <div className="d-flex justify-content-between align-items-end mb-5">

                    <div>

                        <h1 className="fw-bold">
                            Community Leaderboard
                        </h1>

                        <p className="text-muted mb-0">
                            See who's leading the SkillSwap
                            community through learning and teaching.
                        </p>

                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={viewMyRank}
                    >
                        View My Rank
                    </button>

                </div>


                {/* My Stats */}

                {myRank && (
                    <LeaderBoardStats
                        myRank={myRank}
                    />
                )}


                {/* Podium */}

                <LeaderBoardPodium
                    users={users.slice(0, 3)}
                />


                {/* Table */}

                <div id="leaderboard-table">

                    <LeaderBoardTable
                        users={users}
                        currentUserId={myRank?.id}
                        navigate={navigate}
                    />

                </div>

            </div>

        </div>
    )
}

export default LeaderBoard