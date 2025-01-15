import axios from "axios";

export class AxiousObj {
    #request
    #progressBar = document.getElementById("progressBar");
    #body = document.querySelector("body");



    constructor(base, token) {
        this.axiosInstance = axios.create({
            baseURL: base,
            headers: {
                'x-api-key': token,
            },
        });
        this.addInterseptor()
    }

    async axiousGet(link, loadWindow) {
        try {
            this.#request = await this.axiosInstance.get(link, {
                responseType: 'json',
                //6
                onDownloadProgress: this.updateProgress.bind(this)
            })

            loadWindow(this.#request.data)
        } catch (e) {
            console.log(e);

        }
    }

    async axiousPost(link, data) {
        try {
            let response = await this.axiosInstance.post(link, data)
            return response.data.id
        } catch (e) {
            console.log(e);

        }
    }

    async axiousDel(link, data) {
        try {
            await this.axiosInstance.delete(link, data)
            // loadWindow(this.#request.data)
        } catch (e) {
            console.log(e);

        }
    }
    //5
    addInterseptor() {
        let startTime
        this.axiosInstance.interceptors.request.use((config) => {
            //7
            this.#body.style.cursor = "progress"
            this.#progressBar.style.width = `0%`
            startTime = new Date();
            return config
        })

        this.axiosInstance.interceptors.response.use((response) => {
            this.#body.style.cursor = ""
            const endTime = new Date();
            const duration = endTime - startTime;
            console.log(
                `Request ${response.config.url} completed in ${duration}ms`
            );
            return response
        }, (error) => {
            if (error.config && error.config.metadata) {
                const endTime = new Date();
                const duration = endTime - startTime;
                console.error(
                    `Request ${error.config.url} failed after ${duration}ms`
                );
            }
            return Promise.reject(error);
        }
        )
    }


    updateProgress(update) {
        // console.log(update);
        this.#progressBar.style.width = `${(update.progress * 100)}%`
    }


}