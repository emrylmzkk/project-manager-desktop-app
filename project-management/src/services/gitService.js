import { invoke } from "@tauri-apps/api/core";

export const GitService = {

    async fetchGitDetails(path) {
        try {

            const details = await invoke("get_git_details", { path });
            return details;

        } catch (error) {
            console.error("Git detaylari alinirken hata", error);
            return null;
        }
    },

    async gitFetch(path) {

        try {

            const details = await invoke("git_fetch", { path });
            return details;

        } catch (error) {
            console.error("Git fetch hatasi", error);
            return null;
        }

    },

    async gitPull(path) {

        try {

            const details = await invoke("git_pull", { path });
            return details;

        } catch (error) {
            console.error("Git pull hatasi", error);
            return null;
        }

    },

    async gitAdd(path) {
        try {
            await invoke("git_add", { path });
            return true;
        } catch (error) {
            console.error("Git add hatasi:", error);
            throw error;
        }
    },

    async gitCommit(path, message) {
        try {
            await invoke("git_commit", { path, message });
            return true;
        } catch (error) {
            console.error("Git commit hatasi:", error);
            throw error;
        }
    },

    async gitPush(path) {
        try {
            await invoke("git_push", { path });
            return true;
        } catch (error) {
            console.error("Git push hatasi:", error);
            throw error;
        }
    },

    async gitCheckout(path, branchName) {
        try {
            await invoke("git_checkout", { path, branchName });
            return true;
        } catch (error) {
            console.error("Git checkout hatasi:", error);
            throw error;
        }
    },

    async gitStash(path) {
        try {
            await invoke("git_stash", { path });
            return true;
        } catch (error) {
            console.error("Git stash hatasi:", error);
            throw error;
        }
    },

    async gitInit(path) {
        try {
            await invoke("git_init", { path });
            return true;
        } catch (error) {
            console.error("Git init hatasi:", error);
            throw error;
        }
    },

    async gitRemoteAdd(path, url) {
        try {
            await invoke("git_remote_add", { path, url });
            return true;
        } catch (error) {
            console.error("Git remote add hatasi:", error);
            throw error;
        }
    },

    async gitPushInitial(path) {
        try {
            await invoke("git_push_initial", { path });
            return true;
        } catch (error) {
            console.error("Git initial push hatasi:", error);
            throw error;
        }
    },

    async gitStatus(path) {
        try {
            return await invoke("git_status", { path });
        } catch (error) {
            console.error("Git status hatasi:", error);
            throw error;
        }
    },

    async gitMerge(path, branchName) {

        try {

            return await invoke("git_merge", { path, branchName })

        } catch (error) {
            console.error("Git merge hatasi", error);
            throw error
        }


    }
}