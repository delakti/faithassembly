import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { HiCake, HiCalendar } from 'react-icons/hi';
import { format, parseISO, isFuture } from 'date-fns';

const HospitalityMenu: React.FC = () => {
    const [menus, setMenus] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'hospitality_menus'), orderBy('date', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMenus(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const groupedMenus = menus.reduce((acc, menu) => {
        const date = parseISO(menu.date);
        const monthYear = format(date, 'MMMM yyyy');
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(menu);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div className="space-y-8 font-sans text-stone-800 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div className="border-l-4 border-orange-400 pl-6">
                    <span className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-2 block">Catering</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">Food Menu</h1>
                    <p className="text-stone-500 font-medium mt-2 max-w-2xl">
                        "They broke bread in their homes and ate together with glad and sincere hearts." — Acts 2:46
                    </p>
                </div>
            </div>

            {loading && <p className="text-stone-500">Loading menus...</p>}
            {!loading && menus.length === 0 && (
                <div className="bg-stone-50 rounded-2xl p-12 text-center border border-dashed border-stone-200">
                    <HiCake className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-stone-900">No Menus Scheduled</h3>
                    <p className="text-stone-500">The catering team is currently planning the next feast.</p>
                </div>
            )}

            <div className="space-y-12">
                {Object.entries(groupedMenus).map(([month, monthMenus]: any) => (
                    <div key={month} className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold text-stone-900 border-b border-stone-200 pb-2 flex items-center gap-2">
                            <HiCalendar className="w-6 h-6 text-orange-500" /> {month}
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {monthMenus.map((menu: any) => {
                                const menuDate = parseISO(menu.date);
                                const isUpcoming = isFuture(menuDate);

                                return (
                                    <div key={menu.id} className={`bg-white rounded-2xl p-6 border shadow-sm transition-all hover:shadow-md ${isUpcoming ? 'border-orange-200 ring-1 ring-orange-100' : 'border-stone-200 opacity-80'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="block text-3xl font-black text-stone-800">{format(menuDate, 'dd')}</span>
                                                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{format(menuDate, 'EEEE')}</span>
                                            </div>
                                            {isUpcoming && <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">Upcoming</span>}
                                        </div>

                                        <h3 className="font-bold text-lg text-stone-900 mb-1">{menu.serviceType || 'Sunday Service'}</h3>

                                        <div className="space-y-3 mt-6">
                                            <div>
                                                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Main Course</span>
                                                <p className="text-stone-700 font-medium">{menu.main || 'TBD'}</p>
                                            </div>
                                            {menu.sides && (
                                                <div>
                                                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Sides</span>
                                                    <p className="text-stone-600 text-sm">{menu.sides}</p>
                                                </div>
                                            )}
                                            {menu.dessert && (
                                                <div>
                                                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Dessert</span>
                                                    <p className="text-stone-600 text-sm">{menu.dessert}</p>
                                                </div>
                                            )}
                                        </div>

                                        {menu.notes && (
                                            <div className="mt-4 pt-4 border-t border-stone-100">
                                                <p className="text-xs text-stone-500 italic">"{menu.notes}"</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HospitalityMenu;
