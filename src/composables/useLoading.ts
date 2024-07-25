import {ref} from "vue";

export default function useLoading() {
    const idle = ref(false)

    const start = () => {
        idle.value = true
    }

    const stop = () => {
        idle.value = false
    }

    return ref({
        idle,
        start,
        stop
    })

}
