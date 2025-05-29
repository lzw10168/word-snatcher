// import { useEffect } from "react"
// import { useStore } from "./lib/store"
import "./styles/globals.css"

// function OptionsPage() {
//   const { theme, words } = useStore()

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", theme === "dark")
//   }, [theme])

//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-3xl font-bold mb-8">Word Snatcher 设置</h1>

//       <div className="space-y-8">
//         <section>
//           <h2 className="text-xl font-semibold mb-4">我的单词本</h2>
//           <div className="bg-card rounded-lg p-4">
//             {words.length === 0 ? (
//               <p className="text-muted-foreground">还没有添加任何单词</p>
//             ) : (
//               <ul className="space-y-2">
//                 {words.map((word) => (
//                   <li key={word} className="flex items-center justify-between">
//                     <span>{word}</span>
//                     <button
//                       onClick={() => useStore.getState().removeWord(word)}
//                       className="text-sm text-destructive hover:underline"
//                     >
//                       删除
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </section>

//         <section>
//           <h2 className="text-xl font-semibold mb-4">账号设置</h2>
//           <div className="bg-card rounded-lg p-4">
//             <button
//               onClick={() => {
//                 // TODO: 实现 Chrome 账号登录
//               }}
//               className="bg-primary text-primary-foreground rounded-md px-4 py-2"
//             >
//               使用 Chrome 账号登录
//             </button>
//           </div>
//         </section>

//         <section>
//           <h2 className="text-xl font-semibold mb-4">数据统计</h2>
//           <div className="bg-card rounded-lg p-4">
//             <p className="text-muted-foreground">
//               累计添加单词：{words.length} 个
//             </p>
//             {/* TODO: 添加更多统计数据和图表 */}
//           </div>
//         </section>
//       </div>
//     </div>
//   )
// }

// export default OptionsPage

import type { Provider, User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { supabase } from "./lib/supabase"

function IndexOptions() {
  const [user, setUser] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // 自动从 localStorage 读取账号密码
  useEffect(() => {
    const savedUsername = localStorage.getItem("ws_username")
    const savedPassword = localStorage.getItem("ws_password")
    if (savedUsername) setUsername(savedUsername)
    if (savedPassword) setPassword(savedPassword)
  }, [])

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error(error)
        return
      }
      if (!!data.session) {
        setUser(data.session.user)
        sendToBackground({
          name: "init-session",
          body: {
            refresh_token: data.session.refresh_token,
            access_token: data.session.access_token
          }
        })
      }
    }

    init()
  }, [])

  const handleEmailLogin = async (
    type: "LOGIN" | "SIGNUP",
    username: string,
    password: string
  ) => {
    try {
      // 登录/注册时保存账号密码到 localStorage
      localStorage.setItem("ws_username", username)
      localStorage.setItem("ws_password", password)
      const {
        error,
        data: { user }
      } =
        type === "LOGIN"
          ? await supabase.auth.signInWithPassword({
              email: username,
              password
            })
          : await supabase.auth.signUp({ email: username, password })

      if (error) {
        alert("Error with auth: " + error.message)
      } else if (!user) {
        alert("Signup successful, confirmation mail should be sent soon!")
      } else {
        setUser(user)
      }
    } catch (error) {
      console.log("error", error)
      alert(error.error_description || error)
    }
  }

  const handleOAuthLogin = async (provider: Provider, scopes = "email") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        scopes,
        redirectTo: location.href
      }
    })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-10 flex flex-col gap-8 border border-border/40 backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-center mb-2 text-gray-800 dark:text-gray-100 tracking-tight">
          账号设置
        </h2>
        {user ? (
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xl font-semibold text-primary dark:text-primary-300">
                {user.email}
              </span>
              <span className="text-xs text-muted-foreground">
                ID: {user.id}
              </span>
            </div>
            <button
              className="w-full bg-destructive text-destructive-foreground rounded-full px-6 py-3 font-bold text-lg shadow hover:bg-destructive/80 transition-colors"
              onClick={() => {
                supabase.auth.signOut()
                setUser(null)
              }}>
              退出登录
            </button>
          </div>
        ) : (
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-base font-medium mb-2 text-gray-700 dark:text-gray-200">
                邮箱
              </label>
              <input
                type="email"
                placeholder="请输入邮箱"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border rounded-full bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base shadow-sm dark:bg-gray-800 dark:text-gray-100"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-2 text-gray-700 dark:text-gray-200">
                密码
              </label>
              <input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-full bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base shadow-sm dark:bg-gray-800 dark:text-gray-100"
                autoComplete="current-password"
                required
              />
            </div>
            <div className="flex gap-4 mt-2">
              <button
                type="button"
                className="flex-1 bg-primary text-primary-foreground rounded-full px-6 py-3 font-bold text-lg shadow hover:bg-primary/90 transition-colors"
                onClick={() => handleEmailLogin("SIGNUP", username, password)}>
                注册
              </button>
              <button
                type="button"
                className="flex-1 bg-secondary text-secondary-foreground rounded-full px-6 py-3 font-bold text-lg shadow hover:bg-secondary/80 transition-colors"
                onClick={() => handleEmailLogin("LOGIN", username, password)}>
                登录
              </button>
            </div>
            {/* <div className="flex flex-col gap-2 mt-4">
              <button
                type="button"
                className="w-full bg-gray-800 text-white rounded-full px-6 py-3 font-bold text-lg shadow hover:bg-gray-700 transition-colors"
                onClick={() => handleOAuthLogin("github")}>
                使用 GitHub 登录
              </button>
            </div> */}
          </form>
        )}
      </div>
    </div>
  )
}

export default IndexOptions
