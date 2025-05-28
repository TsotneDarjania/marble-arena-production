"use client";

import { useAppContext } from "@/app/context/AppContexty";
import styles from "./style.module.css";
import Image from "next/image";
import Ticket from "@/app/components/ticket/Ticket";
import { useState } from "react";
import { logout } from "@/app/utils/supabase/action";
import Shadow from "@/app/components/utils/shadow/Shadow";

type TicketData = {
  hostTeamName: string;
  guesteamName: string;
  hostScore: number;
  guestScore: number;
  date: string;
  selectedOption: 0 | 1 | 2;
  isCorrectTicket: boolean;
  coinResult: number;
};

const MOCK_TICKETS: TicketData[] = [
  {
    hostTeamName: "Barcelona",
    guesteamName: "Real Madrid",
    hostScore: 2,
    guestScore: 0,
    date: "Apr 11, 2025",
    selectedOption: 0,
    isCorrectTicket: false,
    coinResult: 12,
  },
  {
    hostTeamName: "Barcelona",
    guesteamName: "Real Madrid",
    hostScore: 2,
    guestScore: 0,
    date: "Apr 11, 2025",
    selectedOption: 1,
    isCorrectTicket: true,
    coinResult: 123,
  },
  // Add more mock tickets...
  {
    hostTeamName: "Barcelona",
    guesteamName: "Real Madrid",
    hostScore: 2,
    guestScore: 0,
    date: "Apr 11, 2025",
    selectedOption: 2,
    isCorrectTicket: true,
    coinResult: 43,
  },
  {
    hostTeamName: "Barcelona",
    guesteamName: "Real Madrid",
    hostScore: 2,
    guestScore: 0,
    date: "Apr 11, 2025",
    selectedOption: 2,
    isCorrectTicket: true,
    coinResult: 76,
  },
  {
    hostTeamName: "Barcelona",
    guesteamName: "Real Madrid",
    hostScore: 2,
    guestScore: 0,
    date: "Apr 11, 2025",
    selectedOption: 1,
    isCorrectTicket: false,
    coinResult: 5,
  },
  {
    hostTeamName: "Barcelona",
    guesteamName: "Real Madrid",
    hostScore: 2,
    guestScore: 0,
    date: "Apr 11, 2025",
    selectedOption: 0,
    isCorrectTicket: true,
    coinResult: 88,
  },
  {
    hostTeamName: "Barcelona",
    guesteamName: "Real Madrid",
    hostScore: 2,
    guestScore: 0,
    date: "Apr 11, 2025",
    selectedOption: 1,
    isCorrectTicket: false,
    coinResult: 0,
  },
];

const TICKETS_PER_PAGE = 6;

export default function ProfilePage() {
  const { user } = useAppContext();
  const [page, setPage] = useState(1);

  const [clickedLogOut, setClickedLogOut] = useState(false);

  const totalPages = Math.ceil(MOCK_TICKETS.length / TICKETS_PER_PAGE);
  const paginatedTickets = MOCK_TICKETS.slice(
    (page - 1) * TICKETS_PER_PAGE,
    page * TICKETS_PER_PAGE
  );

  async function handleLogOut() {
    setClickedLogOut(true);
    const result = await logout();

    if (result.success) {
      window.location.href = "/";
    }
  }

  return (
    <div className={styles.profilePage}>
      {/* User Header */}
      <div className={styles.userInitials}>
        <div className={styles.avatar}>
          <Image
            src="/images/user-profile.png"
            alt="User Avatar"
            fill
            objectFit="contain"
          />
        </div>
        <h1 className={styles.title + " title-font"}>{user?.username}</h1>
      </div>

      {/* Logout */}
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

      {/* Balance */}
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
              <p className={styles.itemText + " text-4xl text-font"}>3</p>
            </div>
          </div>
        </div>

        <hr className={styles.line} />
        <h2 className={styles.userSettingsTitle + " text-font"}>
          User Settings
        </h2>

        {/* Settings */}
        {[
          { label: "Delete Account", icon: "delete.png" },
          { label: "Update Username", icon: "update-username.png" },
          {
            label: "Update Profile Picture",
            icon: "update-profile-picture.png",
          },
        ].map(({ label, icon }, i) => (
          <div key={i} className="flex items-center cursor-pointer">
            <div className={styles.itemLogo + " ml-[-5px]"}>
              <Image
                src={`/images/${icon}`}
                alt={label}
                fill
                objectFit="contain"
              />
            </div>
            <p className={styles.itemText + " text-4xl text-font"}>{label}</p>
          </div>
        ))}
      </div>

      {/* Bet History */}
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
        <div className={styles.totalResults + " text-font"}>
          <p className={styles.negative}>
            Total Lost: <span>-12</span>
          </p>
          <p className={styles.positive}>
            Total Won: <span>+123</span>
          </p>
          <p className={styles.net}>
            Result: <span>+111</span>
          </p>
        </div>

        {/* Tickets */}
        <div className={styles.tickets}>
          {paginatedTickets.map((ticket, i) => (
            <Ticket key={i} {...ticket} />
          ))}
        </div>

        {/* Pagination */}
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
