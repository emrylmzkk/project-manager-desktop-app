import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

export const ProjectService = {
    // Mac klasör seçme diyaloğunu açar 
    async selectDirectory() {
        const selected = await open({
            directory: true,
            multiple: false, //1 secim hakki veriyor
            title: "Projelerinin Bulunduğu Klasörü Seç",
        });
        return selected; // Seçilen path döner (string veya null)
    },

    // Rust'taki scan_projects komutunu çağırır
    async fetchProjects(path) {
        try {
            return await invoke("scan_directory", { basePath: path });
        } catch (error) {
            console.error("Projeler taranırken hata oluştu:", error);
            return [];
        }
    },

    async getFileTree(path) {
        try {
            return await invoke("get_file_tree", { path });
        } catch (error) {
            console.error("Dosya ağacı çekilirken hata:", error);
            return [];
        }
    },

    // Yeni: Tek bir klasörü proje olarak çekmek için
    async addProject(path) {
        try {
            return await invoke("get_project_info", { path });
        } catch (error) {
            console.error("Proje bilgisi alınırken hata:", error);
            return null;
        }
    },

    // Yeni: Projeyi IDE ile açmak için
    async openInIde(path, ide) {
        try {
            await invoke("open_in_ide", { path, ide });
            return true;
        } catch (error) {
            console.error("IDE ile açılırken hata:", error);
            return false;
        }
    },

    // Yeni: Dosya Gezgini'nde (Finder/Explorer) açmak için
    async openInExplorer(path) {
        try {
            await invoke("open_in_file_explorer", { path });
            return true;
        } catch (error) {
            console.error("Dosya gezgini ile açılırken hata:", error);
            return false;
        }
    },

    async selectMultipleDirectories() {

        try {

            const selected = await open({
                directory: true,
                multiple: true, //birden fazla secim hakki veriyor
                title: "Birden fazla klasör seçiniz"
            });

            return Array.isArray(selected) ? selected : (selected ? [selected] : [])

        } catch (error) {
            console.error("Çoklu klasör seçim hatasi");
            return []

        }


    },

    async getProjectsByPaths(paths) {
        try {
            return await invoke("get_projects_from_paths", { paths })
        } catch (error) {
            console.error("Birden fazla proje eklenirken hata meydana geldi", error)
            return []
        }
    }
};