let isProgrammaticChange = false // 全局标记

document.addEventListener('input', async function (event) {
  if (isProgrammaticChange) return // 跳过程序触发的修改
  const target = event.target
  // 检查目标元素是否是输入框
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    const name = target.value.trim()
    // 如果输入的是姓名，则生成候选项
    if (name) {
      chrome.runtime.sendMessage(
        chrome.runtime.id,
        {
          type: 'GET_DATA',
          key: name,
        },
        {},
        (response) => {
          showSuggestions(target, response)
        },
      )
    } else {
      hideSuggestions()
    }
  }
})

// 在全局添加键盘事件监听
document.addEventListener('keydown', function (event) {
  const popup = document.getElementById('suggestions-popup')
  if (!popup) return

  const items = popup.querySelectorAll('.suggestion-item')
  if (items.length === 0) return

  let currentIndex = parseInt(popup.getAttribute('data-current-index')) || 0
  // 处理键盘事件
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      currentIndex = (currentIndex + 1) % items.length
      break
    case 'ArrowUp':
      event.preventDefault()
      currentIndex = (currentIndex - 1 + items.length) % items.length
      break
    case 'Enter':
      event.preventDefault()
      if (currentIndex >= 0 && currentIndex < items.length) {
        items[currentIndex].click()
      }
      return
    default:
      return
  }

  // 更新状态和样式
  popup.setAttribute('data-current-index', currentIndex.toString())
  popup.setAttribute('data-scrolling', 'true')
  items.forEach((item, index) => {
    let match = index === currentIndex
    item.style.backgroundColor = match ? '#f8f9fa' : ''
    if (match) {
      // 设置滚动标记
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  })
  setTimeout(() => popup.removeAttribute('data-scrolling'), 100)
})

function smartInputValue(inputElement, suggestion) {
  return () => {
    isProgrammaticChange = true // 标记为程序修改
    inputElement.value = suggestion.email
    // 触发input事件
    const inputEvent = new Event('input', { bubbles: true })
    inputElement.dispatchEvent(inputEvent)

    // 触发change事件
    const changeEvent = new Event('change', { bubbles: true })
    inputElement.dispatchEvent(changeEvent)
    hideSuggestions()
    inputElement.focus()
    // 恢复标记（注意异步恢复确保事件处理完成）
    setTimeout(() => {
      isProgrammaticChange = false
    }, 100)
  }
}

// 显示候选项
function showSuggestions(inputElement, suggestions) {
  // 移除已有的弹出框
  hideSuggestions()

  // 创建弹出框
  const popup = document.createElement('div')
  popup.id = 'suggestions-popup'
  Object.assign(popup.style, {
    position: 'absolute',
    border: '1px solid #e0e0e0',
    background: '#ffffff',
    zIndex: '9999',
    maxHeight: '180px', // 稍微增加高度
    overflowY: 'auto',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.12)', // 更柔和的阴影
    borderRadius: '8px', //圆角
    overflow: 'hidden', // 修改为 hidden 保留外层圆角
    paddingTop: '32px', // 增加顶部内边距
    width: '300px', // 固定宽度
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', // 系统字体
  })

  // 添加滚动容器
  const scrollWrapper = document.createElement('div')
  Object.assign(scrollWrapper.style, {
    maxHeight: '180px',
    overflowY: 'auto',
    paddingRight: '8px', // 为滚动条预留空间
    borderRadius: '8px', // 保持圆角
  })

  popup.appendChild(scrollWrapper)

  // 自定义滚动条样式（需在CSS中实现）
  const style = document.createElement('style')
  style.textContent = `
  #suggestions-popup::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: transparent;
  }

  #suggestions-popup::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0,0,0,0.2);
    border: 2px solid #ffffff; // 通过边框保持圆角效果
  }

  #suggestions-popup::-webkit-scrollbar-track {
    background-color: transparent;
  }
`
  document.head.appendChild(style)

  // 创建关闭按钮
  const closeButton = document.createElement('button')
  closeButton.textContent = '×'
  Object.assign(closeButton.style, {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#666',
    padding: '4px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    lineHeight: '1',
    transition: 'all 0.2s',
  })
  // 添加悬停效果
  closeButton.addEventListener('mouseover', () => (closeButton.style.background = '#f5f5f5'))
  closeButton.addEventListener('mouseout', () => (closeButton.style.background = 'transparent'))
  closeButton.addEventListener('click', hideSuggestions)
  popup.appendChild(closeButton)

  // 添加候选项
  if (suggestions && suggestions.length > 0) {
    suggestions.forEach((suggestion, index) => {
      const item = document.createElement('div')
      item.className = 'suggestion-item' // 添加类名
      Object.assign(item.style, {
        padding: '10px 16px',
        cursor: 'pointer',
        borderBottom: '1px solid #f5f5f5', // 更浅的分隔线
        color: '#333', // 确保黑色文字
        fontSize: '14px',
        lineHeight: '1.5',
        transition: 'background 0.2s',
      })
      item.textContent = `${suggestion.name} - ${suggestion.email}`
      // 初始化的时候默认选中第一个
      if (index === 0) {
        popup.setAttribute('data-current-index', '0')
        item.style.backgroundColor = '#f8f9fa'
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
      // 添加悬停效果
      item.addEventListener('mouseover', () => {
        const popup = document.getElementById('suggestions-popup')
        // 如果是按键触发的滚动期间，忽略悬停事件
        if (popup && popup.getAttribute('data-scrolling') === 'true') {
          return
        }
        const items = popup.querySelectorAll('.suggestion-item')
        if (items.length === 0) {
          return
        }
        // 设置当前位置的index
        popup.setAttribute('data-current-index', index)
        // 设置当前位置背景，移除其他位置背景色
        items.forEach((item, i) => {
          let match = i === index
          item.style.backgroundColor = match ? '#f8f9fa' : ''
          if (match) {
            item.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
          }
        })
      })
      item.addEventListener('mouseout', () => (item.style.background = '#fff'))
      item.addEventListener('click', smartInputValue(inputElement, suggestion))
      scrollWrapper.appendChild(item)
    })
  } else {
    const item = document.createElement('div')
    Object.assign(item.style, {
      padding: '12px 16px',
      color: '#666', // 灰色提示文字
      fontSize: '14px',
      pointerEvents: 'none', // 禁用交互
    })
    item.textContent = '未找到匹配的牌手'
    scrollWrapper.appendChild(item)
  }

  // 将弹出框添加到页面中
  document.body.appendChild(popup)

  // 定位弹出框
  const rect = inputElement.getBoundingClientRect()
  popup.style.top = `${rect.bottom + window.scrollY}px`
  popup.style.left = `${rect.left + window.scrollX}px`
}

// 隐藏候选项
function hideSuggestions() {
  const popup = document.getElementById('suggestions-popup')
  if (popup) {
    popup.remove()
  }
}
