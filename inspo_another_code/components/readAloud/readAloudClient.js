import dynamic from "next/dynamic"

const ReadAloudClient = dynamic(() => import("./readAloud"), {
  ssr: false,
})

export default ReadAloudClient
