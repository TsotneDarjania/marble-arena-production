"use client";

import { useAppContext } from "@/app/context/AppContexty";
import styles from "./style.module.css";
import Image from "next/image";
import Ticket from "@/app/components/ticket/Ticket";
import { useEffect, useState } from "react";
import { logout } from "@/app/utils/supabase/actions/authActions";
import Shadow from "@/app/components/utils/shadow/Shadow";
import { getUserTickets } from "@/app/utils/supabase/actions/getUserTickets";
import { deleteUser } from "@/app/utils/supabase/actions/deleteUser";

export type TicketData = {
  hostTeamName: string;
  guesteamName: string;
  hostScore: number | null;
  guestScore: number | null;
  date: string;
  selectedOption: 0 | 1 | 2;
  isCorrectTicket: boolean;
  coinResult: number;
};

type RawTicketData = {
  option: "host" | "draw" | "guest";
  result: "host" | "draw" | "guest" | "unknown";
  created_at: string;
  potential_win: number;
  teams: {
    host: string;
    guest: string;
  };
};

const TICKETS_PER_PAGE = 6;

export default function ProfilePage() {
  const { user } = useAppContext();

  // ✅ HOOKS must be declared unconditionally at the top
  const [page, setPage] = useState(1);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [clickedLogOut, setClickedLogOut] = useState(false);

  useEffect(() => {
    if (!user) {
      window.location.href = "/";
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const response = await getUserTickets(user.id);
      if (response.success && response.data) {
        const transformed = (response.data as RawTicketData[]).map(
          (ticket): TicketData => {
            const option =
              ticket.option === "host" ? 0 : ticket.option === "draw" ? 1 : 2;

            const isCorrect =
              ticket.result === "unknown"
                ? false
                : (ticket.result === "host" && option === 0) ||
                  (ticket.result === "draw" && option === 1) ||
                  (ticket.result === "guest" && option === 2);

            return {
              hostTeamName: ticket.teams.host,
              guesteamName: ticket.teams.guest,
              hostScore:
                ticket.result === "unknown"
                  ? null
                  : ticket.result === "host"
                  ? 2
                  : ticket.result === "guest"
                  ? 1
                  : 1,
              guestScore:
                ticket.result === "unknown"
                  ? null
                  : ticket.result === "guest"
                  ? 2
                  : ticket.result === "host"
                  ? 0
                  : 1,
              date: new Date(ticket.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              selectedOption: option,
              isCorrectTicket: isCorrect,
              coinResult: isCorrect ? ticket.potential_win : 0,
            };
          }
        );

        setTickets(transformed);
      }
    })();
  }, [user]);

  if (!user) return null;

  const totalPages = Math.ceil(tickets.length / TICKETS_PER_PAGE);
  const paginatedTickets = tickets.slice(
    (page - 1) * TICKETS_PER_PAGE,
    page * TICKETS_PER_PAGE
  );

  async function handleUpdateUsername(newUsername: string) {
    const res = await fetch("/api/updateUsername", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user!.id, username: newUsername }),
    });

    const result = await res.json();

    if (result.success) {
      alert("Username updated!");
      window.location.reload();
    } else {
      alert("Error updating username: " + result.message);
    }
  }

  async function handleUpdateProfilePicture() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user!.id);

      const res = await fetch("/api/updateProfilePicture", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        alert("Profile picture updated!");
        window.location.reload();
      } else {
        alert("Error: " + result.message);
      }
    };

    fileInput.click();
  }

  async function handleDeleteAccount() {
    const confirmed = confirm(
      "Are you sure? This will permanently delete your account."
    );
    if (!confirmed) return;

    const cleanupResult = await deleteUser(user!.id);
    if (!cleanupResult.success) {
      alert("Error during cleanup: " + cleanupResult.message);
      return;
    }

    const res = await fetch("/api/deleteUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user!.id }),
    });

    const result = await res.json();
    if (!result.success) {
      alert("Error deleting auth user: " + result.message);
      return;
    }

    alert("Account deleted successfully.");
    window.location.href = "/";
  }

  async function handleLogOut() {
    setClickedLogOut(true);
    const result = await logout();
    if (result.success) {
      window.location.href = "/";
    }
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.userInitials}>
        <div className={styles.avatar}>
          <Image
            src={user.profileImage}
            alt="User Avatar"
            fill
            objectFit="contain"
          />
        </div>
        <h1 className={styles.title + " title-font"}>{user?.username}</h1>
      </div>

      <div className={styles.logout}>
        <div className={styles.logOutIcon}>
          <Image
            src="/images/log-out.png"
            alt="Logout"
            fill
            objectFit="contain"
          />
        </div>
        <p onClick={handleLogOut} className=" text-font">
          Log Out
        </p>
      </div>

      <div className={styles.content}>
        <div className="flex justify-center w-full">
          <div className={styles.item}>
            <p className={styles.itemTitle + " text-font"}>BALANCE</p>
            <div className="flex items-center cursor-pointer justify-center ">
              <div className={styles.itemLogo + " ml-[-5px]"}>
                <Image
                  src="/images/marble-coin.png"
                  alt="Balance"
                  fill
                  objectFit="contain"
                />
              </div>
              <p className={styles.itemText + " text-4xl text-font"}>
                {user?.coins}
              </p>
            </div>
          </div>
        </div>

        <hr className={styles.line} />
        <h2 className={styles.userSettingsTitle + " text-font"}>
          User Settings
        </h2>

        {["Delete Account", "Update Username", "Update Profile Picture"].map(
          (label, i) => (
            <div
              onClick={() => {
                if (label === "Delete Account") handleDeleteAccount();
                if (label === "Update Username") {
                  const newUsername = prompt("Enter your new username:");
                  if (newUsername && newUsername.trim() !== "") {
                    handleUpdateUsername(newUsername.trim());
                  }
                }
                if (label === "Update Profile Picture") {
                  handleUpdateProfilePicture();
                }
              }}
              key={i}
              className="flex items-center cursor-pointer"
            >
              <div className={styles.itemLogo + " ml-[-5px]"}>
                <Image
                  src={`/images/${
                    label === "Delete Account"
                      ? "delete"
                      : label === "Update Username"
                      ? "update-username"
                      : "update-profile-picture"
                  }.png`}
                  alt={label}
                  fill
                  objectFit="contain"
                />
              </div>
              <p className={styles.itemText + " text-4xl text-font"}>{label}</p>
            </div>
          )
        )}
      </div>

      <div>
        <div className={styles.betHistoryHead}>
          <div className={styles.betLogo + " ml-[-10px]"}>
            <Image
              src="/images/tickets.png"
              alt="Tickets"
              fill
              objectFit="contain"
            />
          </div>
          <h2 className="text-font">Bet History</h2>
        </div>

        <div className={styles.tickets}>
          {paginatedTickets.map((ticket, i) => (
            <Ticket key={i} {...ticket} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={
                  "text-font " +
                  styles.pageButton +
                  (page === index + 1 ? " " + styles.activePage : "")
                }
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {clickedLogOut && <Shadow />}
    </div>
  );
}
