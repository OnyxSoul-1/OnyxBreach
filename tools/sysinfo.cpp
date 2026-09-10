// sysinfo.cpp — Real C++ system info collector (read-only, safe)
// Compile: g++ -O2 -o sysinfo sysinfo.cpp
// Usage:   ./sysinfo
// This is what a legitimate IT audit tool looks like in C++.

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <dirent.h>
#include <unistd.h>
#include <sys/utsname.h>
#include <sys/sysinfo.h>
#include <chrono>
#include <thread>

class SysInfo {
public:
    void run() {
        printHeader();
        printKernel();
        printMemory();
        printCPU();
        printProcesses();
        printUptime();
        printFooter();
    }

private:
    void printHeader() {
        std::cout << "\033[1;36m";
        std::cout << "⛧ ONYXBREACH — SYSTEM INVENTORY\n";
        std::cout << "═════════════════════════════════════════\n";
        std::cout << "\033[0m";
    }

    void printKernel() {
        struct utsname u;
        if (uname(&u) == 0) {
            std::cout << "\n▸ KERNEL\n";
            std::cout << "  sysname:  " << u.sysname << "\n";
            std::cout << "  nodename: " << u.nodename << "\n";
            std::cout << "  release:  " << u.release << "\n";
            std::cout << "  version:  " << u.version << "\n";
            std::cout << "  machine:  " << u.machine << "\n";
        }
    }

    void printMemory() {
        struct sysinfo si;
        if (sysinfo(&si) == 0) {
            long total_mb = (si.totalram * si.mem_unit) / (1024 * 1024);
            long free_mb  = (si.freeram  * si.mem_unit) / (1024 * 1024);
            long used_mb  = total_mb - free_mb;
            std::cout << "\n▸ MEMORY\n";
            std::cout << "  total: " << total_mb << " MB\n";
            std::cout << "  used:  " << used_mb  << " MB\n";
            std::cout << "  free:  " << free_mb  << " MB\n";
        }
    }

    void printCPU() {
        std::ifstream f("/proc/cpuinfo");
        std::string line;
        int cores = 0;
        std::string model;
        while (std::getline(f, line)) {
            if (line.find("model name") == 0 && model.empty()) {
                auto pos = line.find(':');
                if (pos != std::string::npos) model = line.substr(pos + 2);
            }
            if (line.find("processor") == 0) cores++;
        }
        std::cout << "\n▸ CPU\n";
        std::cout << "  model: " << (model.empty() ? "unknown" : model) << "\n";
        std::cout << "  cores: " << cores << "\n";
    }

    void printProcesses() {
        DIR* d = opendir("/proc");
        if (!d) return;
        int count = 0;
        struct dirent* e;
        while ((e = readdir(d)) != nullptr) {
            if (e->d_name[0] >= '0' && e->d_name[0] <= '9') count++;
        }
        closedir(d);
        std::cout << "\n▸ PROCESSES\n";
        std::cout << "  count: " << count << " running\n";
    }

    void printUptime() {
        std::ifstream f("/proc/uptime");
        double up = 0;
        f >> up;
        int days  = (int)(up / 86400);
        int hours = ((int)up % 86400) / 3600;
        int mins  = ((int)up % 3600) / 60;
        std::cout << "\n▸ UPTIME\n";
        std::cout << "  " << days << "d " << hours << "h " << mins << "m\n";
    }

    void printFooter() {
        std::cout << "\n\033[1;32m✅ Inventory complete. Read-only. Nothing modified.\033[0m\n";
    }
};

int main() {
    SysInfo s;
    s.run();
    return 0;
}
