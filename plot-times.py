import matplotlib.pyplot as plt
import csv
import os

if not os.path.exists("output/times"):
    os.makedirs("output/times")

for file in os.listdir("output/times"):
        os.remove("output/times/" + file)

def plot_results(fc_results, mac_results ,title, filename):
    plt.title(title)
    plt.xlabel("n")
    plt.gca().get_xaxis().get_major_locator().set_params(integer=True)
    plt.ylabel("average time (ms)")

    plt.plot([result[0] for result in fc_results], [result[1] for result in fc_results], marker="o", linestyle="solid", linewidth=1, markersize=3)
    plt.plot([result[0] for result in mac_results], [result[1] for result in mac_results], marker="o", linestyle="solid", linewidth=1, markersize=3)
    plt.legend(["FC", "MAC"])
    plt.savefig(filename.replace("results.png", "avg_results.png"), bbox_inches="tight")
    plt.close()
    
    plt.title(title)
    plt.xlabel("n")
    plt.gca().get_xaxis().get_major_locator().set_params(integer=True)
    plt.ylabel("median time (ms)")
    plt.plot([result[0] for result in fc_results], [result[2] for result in fc_results], marker="o", linestyle="solid", linewidth=1, markersize=3)
    plt.plot([result[0] for result in mac_results], [result[2] for result in mac_results], marker="o", linestyle="solid", linewidth=1, markersize=3)
    plt.legend(["FC", "MAC"])
    plt.savefig(filename.replace("results.png", "med_results.png"), bbox_inches="tight")
    plt.close()

    plt.title(title)
    plt.xlabel("n")
    plt.gca().get_xaxis().get_major_locator().set_params(integer=True)
    plt.ylabel("average backtracks")
    plt.plot([result[0] for result in fc_results], [result[3] for result in fc_results], marker="o", linestyle="solid", linewidth=1, markersize=3)
    plt.plot([result[0] for result in mac_results], [result[3] for result in mac_results], marker="o", linestyle="solid", linewidth=1, markersize=3)
    plt.legend(["FC", "MAC"])
    plt.savefig(filename.replace("results.png", "avg_backtracks.png"), bbox_inches="tight")
    plt.close()

with open("output/times.csv", "r") as results_file:
    results = csv.reader(results_file, delimiter=",")
    next(results, None)

    fc_3_results = []
    mac_3_results = []
    fc_4_results = []
    mac_4_results = []

    for result in results:
        if result[0] == "fc" and result[2] == "3":
            fc_3_results.append((int(result[1]),float(result[3]),float(result[4]),float(result[6])))
        elif result[0] == "mac" and result[2] == "3":
            mac_3_results.append((int(result[1]),float(result[3]),float(result[4]),float(result[6])))
        elif result[0] == "fc" and result[2] == "4":
            fc_4_results.append((int(result[1]),float(result[3]),float(result[4]),float(result[6])))
        elif result[0] == "mac" and result[2] == "4":
            mac_4_results.append((int(result[1]),float(result[3]),float(result[4]),float(result[6])))

    plot_results(fc_3_results, mac_3_results, "K=3", "output/times/k3_results.png")
    plot_results(fc_4_results, mac_4_results, "K=4", "output/times/k4_results.png")
