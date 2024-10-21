import React from 'react'
import toast from "react-hot-toast";

const errorToast = () => {
  return toast.error({
    style: {
        background: "red",
        color: "#fff",
      },
})
}

export default errorToast
