import { PaginationProps } from '../interfaces'

const Pagination = ({ totalPage, currentPage, prev, next, setPage }: PaginationProps) => {
  const listItem = []

  for (let i = 1; i < totalPage + 1; i++) {
    if (i > 8) break
    listItem.push(
      <li className={`page-item ${i === currentPage && 'active'}`} key={i}>
        <button className='page-link' onClick={() => setPage!(i)}>
          {i}
        </button>
      </li>
    )
  }

  return (
    <nav>
      <ul className='pagination justify-content-center'>
        <li className={`page-item ${prev === 0 && 'disabled'}`}>
          <button className='page-link' onClick={() => setPage!(currentPage - 1)}>
            Prev
          </button>
        </li>
        {listItem.map(i => i)}
        <li className={`page-item ${(next === totalPage + 1 || next > 8) && 'disabled'}`}>
          <button className='page-link' onClick={() => setPage!(currentPage + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination
