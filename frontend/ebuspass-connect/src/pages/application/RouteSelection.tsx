import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import {
  AlertTriangle,
  ArrowRight,
  BusFront,
  CheckCircle2,
  ChevronDown,
  Loader2,
  MapPin,
  Navigation2,
  Route as RouteIcon,
  Search,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { locationService, type BusStandLocation } from '@/services';
import { Route } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface RouteSelectionProps {
  routes: Route[];
  selectedRoute: Route | null;
  onRouteSelect: (route: Route | null) => void;
}

const FARE_PER_KM = 2;
const MONTHLY_DAYS = 30;
const MAX_DISTANCE_KM = 80;

const formatCurrency = (value: number) => value.toLocaleString('en-IN');

const normalize = (value: string) => value.trim().toLowerCase();

const getRouteScore = (route: Route, startStand: BusStandLocation, endStand: BusStandLocation) => {
  const startName = normalize(startStand.name);
  const endName = normalize(endStand.name);
  const source = normalize(route.source);
  const destination = normalize(route.destination);
  const routeText = normalize([route.name, route.source, route.destination, ...route.stops].join(' '));

  let score = 0;

  if (source === startName) score += 8;
  if (destination === endName) score += 8;
  if (route.stops.some(stop => normalize(stop) === startName)) score += 4;
  if (route.stops.some(stop => normalize(stop) === endName)) score += 4;
  if (routeText.includes(startName)) score += 2;
  if (routeText.includes(endName)) score += 2;

  return score;
};

const IndiaMapCard = ({
  selectedState,
  selectedDistrict,
  startStand,
  endStand,
}: {
  selectedState: string;
  selectedDistrict: string;
  startStand: BusStandLocation | null;
  endStand: BusStandLocation | null;
}) => {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // India center coordinates
  const indiaCenter = { lat: 20.5937, lng: 78.9629 };
  
  // Convert BusStandLocation to map marker format if they have coordinates
  const markers = [];
  if (startStand?.latitude && startStand?.longitude) {
    markers.push({
      lat: startStand.latitude,
      lng: startStand.longitude,
      label: 'Start',
      color: '#22c55e',
    });
  }
  if (endStand?.latitude && endStand?.longitude) {
    markers.push({
      lat: endStand.latitude,
      lng: endStand.longitude,
      label: 'End',
      color: '#ef4444',
    });
  }

  // Create polyline path if both markers exist
  const polylinePath = markers.length === 2 ? [
    { lat: markers[0].lat, lng: markers[0].lng },
    { lat: markers[1].lat, lng: markers[1].lng },
  ] : [];

  return (
    <Card variant="glass" className="overflow-hidden border-slate-200/10 bg-slate-950 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_28%)]" />
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:34px_34px]" />

      <CardContent className="relative space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="secondary" className="border-white/10 bg-white/10 text-white hover:bg-white/15">
              Map
            </Badge>
            <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
              The map area helps the user understand the travel zone before choosing state, district, start point, and end point.
            </p>
          </div>
        </div>

        <div className="relative min-h-[340px] overflow-hidden rounded-[24px] border border-white/10">
          {!GOOGLE_MAPS_API_KEY ? (
            <div className="flex h-[340px] items-center justify-center rounded-[24px] bg-slate-900/50">
              <div className="text-center">
                <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-amber-500" />
                <p className="mb-2 font-semibold text-white">Google Maps API Key Missing</p>
              
              </div>
            </div>
          ) : (
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={{
                  width: '100%',
                  height: '340px',
                  borderRadius: '24px',
                }}
                center={startStand?.latitude && startStand?.longitude ? 
                  { lat: startStand.latitude, lng: startStand.longitude } : 
                  indiaCenter
                }
                zoom={startStand && endStand ? 7 : 5}
                options={{
                  styles: [
                    {
                      elementType: 'geometry',
                      stylers: [{ color: '#0f172a' }],
                    },
                  {
                    elementType: 'labels.text.stroke',
                    stylers: [{ color: '#0f172a' }],
                  },
                  {
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#e0e7ff' }],
                  },
                  {
                    featureType: 'administrative.locality',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#9ca3af' }],
                  },
                  {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{ color: '#38444d' }],
                  },
                  {
                    featureType: 'road',
                    elementType: 'geometry.stroke',
                    stylers: [{ color: '#212121' }],
                  },
                  {
                    featureType: 'road.highway',
                    elementType: 'geometry',
                    stylers: [{ color: '#3c4e4f' }],
                  },
                  {
                    featureType: 'road.highway',
                    elementType: 'geometry.stroke',
                    stylers: [{ color: '#212121' }],
                  },
                  {
                    featureType: 'road.arterial',
                    elementType: 'geometry',
                    stylers: [{ color: '#38444d' }],
                  },
                  {
                    featureType: 'poi',
                    elementType: 'geometry',
                    stylers: [{ color: '#181818' }],
                  },
                  {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{ color: '#0e4429' }],
                  },
                  {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#4fd0e7' }],
                  },
                ],
              }}
            >
              {/* Draw markers for start and end points */}
              {startStand?.latitude && startStand?.longitude && (
                <Marker
                  position={{ lat: startStand.latitude, lng: startStand.longitude }}
                  title={`Start: ${startStand.name}`}
                  icon={`http://maps.google.com/mapfiles/ms/icons/green-dot.png`}
                />
              )}
              {endStand?.latitude && endStand?.longitude && (
                <Marker
                  position={{ lat: endStand.latitude, lng: endStand.longitude }}
                  title={`End: ${endStand.name}`}
                  icon={`http://maps.google.com/mapfiles/ms/icons/red-dot.png`}
                />
              )}

              {/* Draw route line between points */}
              {polylinePath.length === 2 && (
                <Polyline
                  path={polylinePath}
                  options={{
                    strokeColor: '#3b82f6',
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                  }}
                />
              )}
            </GoogleMap>
            </LoadScript>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const StandPicker = ({
  label,
  placeholder,
  helperText,
  searchPlaceholder,
  selected,
  options,
  query,
  onQueryChange,
  open,
  onOpenChange,
  onSelect,
  loading,
  disabled,
  emptyMessage,
}: {
  label: string;
  placeholder: string;
  helperText: string;
  searchPlaceholder: string;
  selected: BusStandLocation | null;
  options: BusStandLocation[];
  query: string;
  onQueryChange: (value: string) => void;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onSelect: (value: BusStandLocation) => void;
  loading: boolean;
  disabled: boolean;
  emptyMessage: string;
}) => {
  const filteredOptions = useMemo(() => {
    const search = normalize(query);

    return options.filter(option => {
      if (!search) return true;

      return [option.name, option.district, option.state, option.note ?? '']
        .join(' ')
        .toLowerCase()
        .includes(search);
    });
  }, [options, query]);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex h-full min-h-[120px] w-full items-start justify-between gap-4 rounded-[22px] border-2 border-slate-200/70 bg-white px-4 py-4 text-left shadow-[0_14px_35px_rgba(15,23,42,0.05)] transition-all duration-200 hover:border-primary/40 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] focus:outline-none focus:ring-2 focus:ring-primary/30',
            selected && 'border-primary/40 bg-primary/5',
            disabled && 'cursor-not-allowed opacity-60',
          )}
        >
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
            <p className="mt-2 truncate text-base font-semibold text-foreground">
              {selected ? selected.name : placeholder}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {selected ? `${selected.district}, ${selected.state}` : helperText}
            </p>
            {selected?.note && <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{selected.note}</p>}
          </div>
          <div className="flex items-center gap-2 pt-1 text-muted-foreground">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <ChevronDown className="h-4 w-4" />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[min(92vw,28rem)] p-0" align="start">
        <div className="border-b p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={event => onQueryChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="max-h-72">
          <div className="p-2">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">{emptyMessage}</div>
            ) : (
              filteredOptions.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onSelect(option);
                    onOpenChange(false);
                  }}
                  className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-accent/10"
                >
                  <span className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                    <Navigation2 className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-foreground">{option.name}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {option.district}, {option.state}
                    </span>
                    {option.note && <span className="mt-1 block text-xs text-muted-foreground">{option.note}</span>}
                  </span>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

const RouteSelection: React.FC<RouteSelectionProps> = ({ routes, selectedRoute, onRouteSelect }) => {
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [busStands, setBusStands] = useState<BusStandLocation[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [startStand, setStartStand] = useState<BusStandLocation | null>(null);
  const [endStand, setEndStand] = useState<BusStandLocation | null>(null);
  const [startQuery, setStartQuery] = useState('');
  const [endQuery, setEndQuery] = useState('');
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [busStandsLoading, setBusStandsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadStates = async () => {
      try {
        setStatesLoading(true);
        const data = await locationService.getStates();

        if (!cancelled) {
          setStates(data);
        }
      } catch (error) {
        if (!cancelled) {
          setStates([]);
          toast.error(error instanceof Error ? error.message : 'Failed to load states');
        }
      } finally {
        if (!cancelled) {
          setStatesLoading(false);
        }
      }
    };

    loadStates();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadDistricts = async () => {
      if (!selectedState) {
        setDistricts([]);
        setSelectedDistrict('');
        return;
      }

      try {
        setDistrictsLoading(true);
        const data = await locationService.getDistricts(selectedState);

        if (!cancelled) {
          setDistricts(data);
        }
      } catch (error) {
        if (!cancelled) {
          setDistricts([]);
          toast.error(error instanceof Error ? error.message : 'Failed to load districts');
        }
      } finally {
        if (!cancelled) {
          setDistrictsLoading(false);
        }
      }
    };

    loadDistricts();

    return () => {
      cancelled = true;
    };
  }, [selectedState]);

  useEffect(() => {
    let cancelled = false;

    const loadBusStands = async () => {
      if (!selectedState || !selectedDistrict) {
        setBusStands([]);
        setStartStand(null);
        setEndStand(null);
        return;
      }

      try {
        setBusStandsLoading(true);
        const data = await locationService.getBusStands(selectedState, selectedDistrict);

        if (!cancelled) {
          setBusStands(data);
        }
      } catch (error) {
        if (!cancelled) {
          setBusStands([]);
          toast.error(error instanceof Error ? error.message : 'Failed to load bus stands');
        }
      } finally {
        if (!cancelled) {
          setBusStandsLoading(false);
        }
      }
    };

    loadBusStands();

    return () => {
      cancelled = true;
    };
  }, [selectedState, selectedDistrict]);

  useEffect(() => {
    setSelectedDistrict('');
    setStartStand(null);
    setEndStand(null);
    setStartQuery('');
    setEndQuery('');
    onRouteSelect(null);
  }, [selectedState, onRouteSelect]);

  const startOptions = useMemo(() => {
    const search = normalize(startQuery);

    return busStands.filter(stand => {
      if (!search) return true;

      return [stand.name, stand.district, stand.state, stand.note ?? '']
        .join(' ')
        .toLowerCase()
        .includes(search);
    });
  }, [busStands, startQuery]);

  const endOptions = useMemo(() => {
    const search = normalize(endQuery);

    return busStands.filter(stand => {
      if (stand.id === startStand?.id) return false;
      if (!search) return true;

      return [stand.name, stand.district, stand.state, stand.note ?? '']
        .join(' ')
        .toLowerCase()
        .includes(search);
    });
  }, [busStands, endQuery, startStand?.id]);

  const routeMatches = useMemo(() => {
    if (!startStand || !endStand) return [];

    return routes
      .filter(route => route.distance <= MAX_DISTANCE_KM)
      .map(route => ({
        route,
        score: getRouteScore(route, startStand, endStand),
        monthlyFare: route.distance * FARE_PER_KM ,
      }))
      .filter(match => match.score > 0)
      .sort((left, right) => right.score - left.score || left.route.distance - right.route.distance);
  }, [routes, startStand, endStand]);

  const activeRoute = routeMatches[0]?.route ?? null;
  const selectedMonthlyFare = activeRoute ? activeRoute.distance * FARE_PER_KM  : 0;

  useEffect(() => {
    if ((activeRoute?.id ?? null) !== (selectedRoute?.id ?? null)) {
      onRouteSelect(activeRoute);
    }
  }, [activeRoute, onRouteSelect, selectedRoute?.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      className="space-y-6"
    >
      <Card variant="bordered" className="border-amber-300/60 bg-amber-50/90">
        <CardContent className="flex items-start gap-3 p-4">
          <div className="rounded-full bg-amber-400/15 p-2 text-amber-700">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Important note</p>
            <p className="text-sm text-muted-foreground">
              Fare is fixed at <span className="font-semibold text-foreground">₹2 per km</span>. Routes longer than{' '}
              <span className="font-semibold text-foreground">80 km</span> are not considered in this selection flow.
            </p>
          </div>
        </CardContent>
      </Card>

      <IndiaMapCard
        selectedState={selectedState}
        selectedDistrict={selectedDistrict}
        startStand={startStand}
        endStand={endStand}
      />

      <Card variant="elevated" className="border-primary/10">
        <CardContent className="space-y-4 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BusFront className="h-4 w-4 text-primary" />
                <p className="font-semibold text-foreground">Location selection</p>
              </div>
            </div>

          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Select state</p>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="h-12 rounded-2xl">
                  <SelectValue placeholder={statesLoading ? 'Loading states...' : 'Select state'} />
                </SelectTrigger>
                <SelectContent>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Select district</p>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={!selectedState}>
                <SelectTrigger className="h-12 rounded-2xl">
                  <SelectValue
                    placeholder={
                      selectedState
                        ? districtsLoading
                          ? 'Loading districts...'
                          : 'Select district'
                        : 'Choose a state first'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {districts.map(district => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card variant="bordered" className="bg-primary/5">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center gap-2">
                <RouteIcon className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Selection summary</p>
              </div>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">State</span>
                  <span className="font-medium text-foreground">{selectedState || 'Not selected'}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">District</span>
                  <span className="font-medium text-foreground">{selectedDistrict || 'Not selected'}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Bus stands</span>
                  <span className="font-medium text-foreground">{busStandsLoading ? 'Loading...' : `${busStands.length} loaded`}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card variant="bordered" className="border-primary/10">
        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Navigation2 className="h-4 w-4 text-primary" />
                <p className="font-semibold text-foreground">Select start and end point</p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick the bus stand where the journey starts and the nearest bus stand near the college for the destination.
              </p>
            </div>

            {/* <Badge variant={busStands.length ? 'success' : 'warning'}>
              {busStands.length ? 'Filled' : 'Pending'}
            </Badge> */}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <StandPicker
              label="Start point"
              placeholder="Choose starting bus stand"
              helperText="Search or scroll the district bus stands."
              searchPlaceholder="Search start stand"
              selected={startStand}
              options={startOptions}
              query={startQuery}
              onQueryChange={setStartQuery}
              open={startOpen}
              onOpenChange={setStartOpen}
              onSelect={stand => {
                setStartStand(stand);
                if (endStand?.id === stand.id) {
                  setEndStand(null);
                }
              }}
              loading={busStandsLoading}
              disabled={!selectedDistrict}
              emptyMessage={selectedDistrict ? 'No bus stands match the search.' : 'Select a state and district to see bus stands.'}
            />

            <StandPicker
              label="End point"
              placeholder="Choose destination bus stand"
              helperText="Pick the nearest stand near the college or campus."
              searchPlaceholder="Search destination stand"
              selected={endStand}
              options={endOptions}
              query={endQuery}
              onQueryChange={setEndQuery}
              open={endOpen}
              onOpenChange={setEndOpen}
              onSelect={setEndStand}
              loading={busStandsLoading}
              disabled={!selectedDistrict}
              emptyMessage={selectedDistrict ? 'No destination stands match the search.' : 'Select a state and district to see bus stands.'}
            />
          </div>
        </CardContent>
      </Card>

      <Card variant="elevated" className="border-primary/10 bg-card/95">
        <CardContent className="space-y-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <p className="font-semibold text-foreground">Selected route and cost</p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                The route is auto-matched from your selected start and end bus stands.
              </p>
            </div>

            <Badge variant={activeRoute ? 'success' : 'warning'}>{activeRoute ? 'Ready' : 'Pending'}</Badge>
          </div>

          <Separator />

          {activeRoute ? (
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Route</span>
                  <span className="font-semibold text-foreground">{activeRoute.name}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">From - To</span>
                  <span className="font-medium text-foreground">
                    {activeRoute.source} <ArrowRight className="mx-1 inline h-4 w-4 text-muted-foreground" /> {activeRoute.destination}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Distance</span>
                  <span className="font-medium text-foreground">{activeRoute.distance} km</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Fare calculation</span>
                  <span className="font-medium text-foreground">₹{FARE_PER_KM} / km</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Monthly pass</span>
                  <span className="font-medium text-foreground">30 days</span>
                </div>
              </div>

              <div className="rounded-[24px] border-2 border-primary/15 bg-primary/5 px-5 py-6 text-right">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Monthly cost</p>
                <p className="mt-2 text-3xl font-bold text-primary">₹{formatCurrency(selectedMonthlyFare)}</p>
                <p className="mt-1 text-sm text-muted-foreground">Calculated from route distance</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-muted/20 px-5 py-8 text-center text-sm text-muted-foreground">
              Select a state, district, start point, and end point to auto-fill the route summary.
            </div>
          )}

          {routeMatches.length > 1 && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Other matched routes</p>
              <div className="flex flex-wrap gap-2">
                {routeMatches.slice(0, 3).map(match => (
                  <Badge key={match.route.id} variant={match.route.id === activeRoute?.id ? 'success' : 'outline'}>
                    {match.route.name} • ₹{formatCurrency(match.monthlyFare)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RouteSelection;