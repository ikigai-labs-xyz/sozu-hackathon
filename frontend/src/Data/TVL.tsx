import { useBalance } from 'wagmi'

function TVL() {
  const { data, isError, isLoading } = useBalance({
    address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    chainId: 1,
    token: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  })

  if (isLoading) return <div>Fetching balance…</div>
  if (isError) return <div>Error fetching balance</div>
  return (
    <>
      {data?.formatted} {data?.symbol}
    </>
  )
}

export default TVL