import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { counterActions } from '../lib/store/slices/counterSlice.js'
import { useParams } from 'react-router-dom'
import MolCounter from '../components/molecules/MolCounter.jsx'

const PagCounters = () => {
  const storeCount = useSelector(state => state.counter.value)
  const [useStateCount, setUseStateCount] = useState(storeCount)
  const dispatch = useDispatch()
  const { value } = useParams()
  const parsedValue = value ? Number(value) : 0
  const useStateActions = {
    increment: () => setUseStateCount(prev => prev + 1),
    decrement: () => setUseStateCount(prev => prev - 1),
    setValue: value => setUseStateCount(value),
  }

  useEffect(() => {
    if (!isNaN(parsedValue)) {
      dispatch(counterActions.setValue(parsedValue))
      setUseStateCount(parsedValue)
    }
  }, [dispatch, setUseStateCount, parsedValue])


  return (
    <div>
        <MolCounter
          name="StoreCount"
          handler={counterActions}
          value={storeCount}
          resetValue={parsedValue}
        />
        <MolCounter
          name="UseStateCount"
          handler={useStateActions}
          value={useStateCount}
          resetValue={parsedValue}
        />
    </div>
  )
}

export default PagCounters
