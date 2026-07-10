import React, {useState} from 'react'

const ReviewModal = () => {
    const [comment, setComment] = useState("")
  const [rating, setrating] = useState(0)

  function handleRating  (e){
        const val = e.target.val;
        if(Number(val) >=0 || Number(val) <=5){
            setrating(val);
        }
  }
  return (
    <div>
        <div>
      <input type="text" value={comment} onChange={(e)=>setComment(e.target.value)} />

      <input type = "number" value={rating} onChange={handleRating}/>
        </div>
    </div>
  )
}

export default ReviewModal