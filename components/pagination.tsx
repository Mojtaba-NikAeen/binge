import { PaginationProps } from '../interfaces'

const Pagination = ({ totalPage, currentPage, prev, next, loadPageFn, name }: PaginationProps) => {
  const listItem = []

  for (let i = 1; i < totalPage + 1; i++) {
    if (i > 8) break
    listItem.push(
      <li className={`page-item ${i === currentPage && 'active'}`}>
        <button className='page-link' onClick={() => loadPage(i, name)}>
          {i}
        </button>
      </li>
    )
  }

  const loadPage = async (page: number, name: string) => {
    if (page === currentPage) return
    console.log('clicked')
    await loadPageFn!(page, name)
  }

  return (
    <nav>
      <ul className='pagination justify-content-center'>
        <li className={`page-item ${prev === 0 && 'disabled'}`}>
          <button className='page-link' onClick={() => loadPage(currentPage - 1, name)}>
            Previous
          </button>
        </li>
        {listItem.map(i => i)}
        <li className={`page-item ${(next === totalPage + 1 || next > 8) && 'disabled'}`}>
          <button className='page-link' onClick={() => loadPage(currentPage + 1, name)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination