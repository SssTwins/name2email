console.info('contentScript is running')

document.addEventListener('input', async function (event) {
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
    borderRadius: '6px', // 稍微增加圆角
    paddingTop: '32px', // 增加顶部内边距
    width: '300px', // 固定宽度
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', // 系统字体
  })

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
    suggestions.forEach((suggestion) => {
      const item = document.createElement('div')
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

      // 添加悬停效果
      item.addEventListener('mouseover', () => (item.style.background = '#f8f9fa'))
      item.addEventListener('mouseout', () => (item.style.background = '#fff'))

      item.addEventListener('click', () => {
        inputElement.value = suggestion.email
        hideSuggestions()
      })
      popup.appendChild(item)
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
    popup.appendChild(item)
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
